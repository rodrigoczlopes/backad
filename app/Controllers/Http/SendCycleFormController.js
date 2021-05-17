/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Comment = use('App/Models/Comment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleJustificative = use('App/Models/EvaluationCycleJustificative');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

// TODO:
// Quando o colaborador mudar de cargo e te muma nova trajetório/path ele precisa apagar o formulário atual do ciclo e criar novamente
// Para que ele não crie questões das duas trajetórias juntas

class SendCycleFormController {
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

      let formId = null;

      // colocando todos os objetos no mesmo nível
      const usersFlat = cleanedUserList.flat();

      const userQuestions = usersFlat.map(async (user) => {
        const position = await Position.find(user.position_id);
        const positionJson = position.toJSON();

        const form = await Form.query()
          .where('path_id', positionJson.path_id)
          .where('active', true)
          .where('company_id', auth.user.company_id)
          .with('behaviorForms')
          .first();

        if (!form) return [];

        formId = form.id;

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

      if (userQuestions?.length === 0) return;

      const userQuestionsAwait = await Promise.all(userQuestions);

      const removeUserWithoutForm = userQuestionsAwait.filter((userQ) => userQ?.length > 0);

      // Clonando esta variável para não alaterar o clone quando excluir o skill_id
      const userJustificative = JSON.parse(JSON.stringify(removeUserWithoutForm));

      await removeUserWithoutForm.forEach(async (questions) => {
        questions.forEach(async (question) => {
          delete question.skill_id;
          await EvaluationCycleAnswer.findOrCreate(
            {
              employee_id: question.employee_id,
              evaluation_cycle_id: question.evaluation_cycle_id,
              behavior_id: question.behavior_id,
            },
            question
          );
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

      await userJustificativeUniques.forEach(async (questions) => {
        questions.forEach(async (question) => {
          delete question.behavior_id;
          await EvaluationCycleJustificative.findOrCreate(
            {
              employee_id: question.employee_id,
              evaluation_cycle_id: question.evaluation_cycle_id,
              skill_id: question.skill_id,
            },
            question
          );
        });
      });

      const commentUser = userJustificativeUniques.map(async (userF) => {
        const comments = await Comment.all();
        const commentsJson = comments.toJSON();

        return commentsJson.map((comment) => {
          return userF.map((usf) => ({
            employee_id: usf.employee_id,
            form_id: formId,
            evaluation_cycle_id: usf.evaluation_cycle_id,
            comment_id: comment.id,
          }));
        });
      });

      const commentAwait = await Promise.all(commentUser);
      const commentAwaitFlat = commentAwait.flat().flat();

      const commentAwaitFlatUnique = commentAwaitFlat.reduce((acc, current) => {
        const x = acc.find((item) => item.employee_id === current.employee_id && item.comment_id === current.comment_id);
        if (!x) {
          return acc.concat([current]);
        }
        return acc;
      }, []);

      await commentAwaitFlatUnique.forEach(async (com) => {
        await EvaluationCycleComment.findOrCreate(
          { employee_id: com.employee_id, evaluation_cycle_id: com.evaluation_cycle_id, comment_id: com.comment_id },
          com
        );
      });

      return response.status(200).json({ data: removeUserWithoutForm, status: true });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}

module.exports = SendCycleFormController;
