/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleJustificative = use('App/Models/EvaluationCycleJustificative');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

class DepartmentEmployeeController {
  async store({ request, response, auth }) {
    const departments = request.all();
    try {
      const object = departments.data.map(async (department) => {
        const users = await User.query().where('department_id', department.id).where('active', true).with('departments').fetch();

        let items = [];
        users.toJSON().forEach((user) => {
          items = [
            ...items,
            {
              id: user.id,
              name: user.name,
              department_id: user.department_id,
              position_id: user.position_id,
              evaluation_cycle_id: department.evaluation_cycle_id,
              departments: user.departments,
            },
          ];
        });
        return items;
      });

      const objectAwait = await Promise.all(object);
      const cleanedUserList = objectAwait.filter((value) => {
        return value.length > 0;
      });

      // colocando todos os objetos no mesmo nível
      const usersFlat = cleanedUserList.flat();
      let userCommentFormList = [];

      const userQuestions = usersFlat.map(async (user) => {
        const position = await Position.find(user.position_id);
        const positionJson = position.toJSON();

        const form = await Form.query()
          .where('path_id', positionJson.path_id)
          .where('active', true)
          .where('company_id', auth.user.company_id)
          .with('behaviorForms')
          .first();

        userCommentFormList = [
          ...userCommentFormList,
          {
            employee_id: user.id,
            leader_id: user.departments.leader_id,
            form_id: form.id,
            evaluation_cycle_id: user.evaluation_cycle_id,
          },
        ];

        try {
          if (form) {
            const formJSON = form.toJSON();
            const { behaviorForms } = formJSON;
            let questions = [];
            const bhs = behaviorForms.map(async (behaviorForm) => {
              const behavior = await Behavior.query().where('id', behaviorForm.behavior_id).first();
              const behaviorjson = behavior.toJSON();
              questions = [
                ...questions,
                {
                  employee_id: user.id,
                  leader_id: user.departments.leader_id,
                  form_id: behaviorForm.form_id,
                  evaluation_cycle_id: user.evaluation_cycle_id,
                  behavior_id: behaviorForm.behavior_id,
                  skill_id: behaviorjson.skill_id,
                },
              ];
            });
            await Promise.all(bhs);
            return questions;
          }
        } catch (error) {
          return response.status(500).json({ message: error.message });
        }
      });
      const userQuestionsAwait = await Promise.all(userQuestions);

      // Clonando esta variável para não alaterar o clone quando excluir o skill_id
      const userJustificative = JSON.parse(JSON.stringify(userQuestionsAwait));

      userQuestionsAwait.forEach(async (questions) => {
        questions.forEach(async (question) => {
          delete question.skill_id;
          await EvaluationCycleAnswer.findOrCreate(question);
        });
      });

      const userJustificativeUniques = userJustificative.map((currentUserJustificative) => {
        return currentUserJustificative.reduce((acc, current) => {
          const x = acc.find((item) => item.employee_id === current.employee_id && item.skill_id === current.skill_id);
          if (!x) {
            return acc.concat([current]);
          }
          return acc;
        }, []);
      });

      userJustificativeUniques.forEach(async (questions) => {
        questions.forEach(async (question) => {
          delete question.behavior_id;
          await EvaluationCycleJustificative.findOrCreate(
            { employee_id: question.employee_id, evaluation_cycle_id: question.evaluation_cycle_id, skill_id: question.skill_id },
            question
          );
        });
      });

      userCommentFormList.forEach(async (commentForm) => {
        await EvaluationCycleComment.findOrCreate(commentForm);
      });

      return userQuestionsAwait;
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}

module.exports = DepartmentEmployeeController;
