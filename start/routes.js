/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('/authenticate', 'AuthController.authenticate').validator('Auth');
Route.post('/forgot', 'ForgotPasswordController.store').validator('ForgotPassword');
Route.post('/reset', 'ResetPasswordController.store').validator('ResetPassword');
Route.get('/files/:file', 'FileController.show');

Route.group(() => {
  Route.put('/profile', 'ProfileController.update').validator('Profile');
  Route.post('/register', 'AuthController.register').validator('RegisterUser');
  Route.put('/resetall', 'ResetPasswordController.update');

  Route.resource('behaviors', 'BehaviorController')
    .apiOnly()
    .validator(
      new Map([
        [['behaviors.store'], ['Behavior']],
        [['behaviors.update'], ['BehaviorUpdate']],
      ])
    );
  Route.resource('behaviorforms', 'BehaviorFormController')
    .apiOnly()
    .validator(
      new Map([
        [['behaviorforms.store'], ['BehaviorForm']],
        [['behaviorforms.update'], ['BehaviorForm']],
      ])
    );
  Route.resource('classifications', 'ClassificationController')
    .apiOnly()
    .validator(
      new Map([
        [['classifications.store'], ['Classification']],
        [['classifications.update'], ['Classification']],
      ])
    );
  Route.resource('comments', 'CommentController')
    .apiOnly()
    .validator(
      new Map([
        [['comments.store'], ['Comment']],
        [['comments.update'], ['Comment']],
      ])
    );
  Route.resource('companies', 'CompanyController')
    .apiOnly()
    .validator(
      new Map([
        [['companies.store'], ['Company']],
        [['companies.update'], ['Company']],
      ])
    );
  Route.resource('departments', 'DepartmentController')
    .apiOnly()
    .validator(
      new Map([
        [['departments.store'], ['Department']],
        [['departments.update'], ['Department']],
      ])
    );
  Route.get('departmentemployees', 'DepartmentEmployeeController.index');
  Route.get('departmenthierarchies', 'DepartmentHierarchyController.index');
  Route.resource('developmentplans', 'DevelopmentPlanController')
    .apiOnly()
    .validator(
      new Map([
        [['developmentplans.store'], ['Development']],
        [['developmentplans.update'], ['Development']],
      ])
    );
  Route.resource('evaluationcycleareas', 'EvaluationCycleAreaController')
    .apiOnly()
    .validator(
      new Map([
        [['evaluationcycleareas.store'], ['EvaluationCycleArea']],
        [['evaluationcycleareas.update'], ['EvaluationCycleArea']],
      ])
    );
  Route.resource('evaluationcycleanswers', 'EvaluationCycleAnswerController').apiOnly();
  Route.resource('evaluationcyclejustificatives', 'EvaluationCycleJustificativeController').apiOnly();
  Route.resource('evaluationcyclecomments', 'EvaluationCycleCommentController').apiOnly();
  Route.resource('evaluationcycles', 'EvaluationCycleController')
    .apiOnly()
    .validator(
      new Map([
        [['evaluationcycles.store'], ['EvaluationCycle']],
        [['evaluationcycles.update'], ['EvaluationCycle']],
      ])
    );
  Route.resource('evaluationcyclelevels', 'EvaluationCycleLevelController')
    .apiOnly()
    .validator(
      new Map([
        [['evaluationcyclelevels.store'], ['EvaluationCycleLevel']],
        [['evaluationcyclelevels.update'], ['EvaluationCycleLevel']],
      ])
    );
  Route.resource('forms', 'FormController')
    .apiOnly()
    .validator(
      new Map([
        [['forms.store'], ['Form']],
        [['forms.update'], ['Form']],
      ])
    );
  Route.resource('hierarchies', 'HierarchyController')
    .apiOnly()
    .validator(
      new Map([
        [['hierarchies.store'], ['Hierarchy']],
        [['hierarchies.update'], ['Hierarchy']],
      ])
    );
  Route.get('leaders', 'LeaderController.index');
  Route.resource('notifications', 'NotificationController')
    .apiOnly()
    .validator(
      new Map([
        [['notifications.store'], ['Notification']],
        [['notifications.update'], ['Notification']],
      ])
    );
  Route.get('pathforms/:id', 'PathFormController.show');
  Route.resource('paths', 'PathController')
    .apiOnly()
    .validator(
      new Map([
        [['paths.store'], ['Path']],
        [['paths.update'], ['Path']],
      ])
    );
  Route.resource('positions', 'PositionController')
    .apiOnly()
    .validator(
      new Map([
        [['positions.store'], ['Position']],
        [['positions.update'], ['Position']],
      ])
    );
  Route.resource('questions', 'QuestionController')
    .apiOnly()
    .validator(
      new Map([
        [['questions.store'], ['Question']],
        [['questions.update'], ['Question']],
      ])
    );
  Route.resource('ratingscales', 'RatingScaleController')
    .apiOnly()
    .validator(
      new Map([
        [['ratingscales.store'], ['RatingScale']],
        [['ratingscales.update'], ['RatingScale']],
      ])
    );
  Route.post('sendcycleforms', 'SendCycleFormController.store');
  Route.resource('skills', 'SkillController')
    .apiOnly()
    .validator(
      new Map([
        [['skills.store'], ['Skill']],
        [['skills.update'], ['Skill']],
      ])
    );
  Route.get('skillbehaviors/:id', 'SkillBehaviorController.index');
  Route.resource('users', 'UserController')
    .apiOnly()
    .validator(new Map([[['users.update'], ['User']]]));

  Route.resource('usergroups', 'UserGroupController')
    .apiOnly()
    .validator(
      new Map([
        [['usergroups.store'], ['UserGroup']],
        [['usergroups.update'], ['UserGroup']],
      ])
    );
}).middleware(['auth']);

// Exemplo de autenticação nas rotas
// Route.get('/app', 'AppController.index').middleware(['auth']);
