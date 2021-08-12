/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('/authenticate', 'AuthController.authenticate').validator('Auth');
Route.post('/forgot', 'ForgotPasswordController.store').validator('ForgotPassword');
Route.post('/reset', 'ResetPasswordController.store').validator('ResetPassword');
Route.get('/files/:file', 'FileController.show');

Route.group(() => {
  Route.put('/profile', 'ProfileController.update').validator('Profile');
  Route.post('/register', 'AuthController.register').middleware(['is:(administrator)']).validator('RegisterUser');
  Route.put('/resetall', 'ResetPasswordController.update').middleware(['is:(administrator)']);
  Route.put('/resetone', 'ResetPasswordController.update').middleware(['is:(administrator)']);
  Route.post('/confirmemployeefeedback', 'ConfirmEmployeeFeedbackController.show').middleware(['is:(evaluator)']);

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

  Route.resource('consolidatedevaluationcycledevelopmentplans', 'ConsolidatedEvaluationCycleDevelopmentPlanController').apiOnly();

  Route.get('dashboardsummaries', 'DashboardSummaryController.index').middleware(['is:(administrator)']);

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
        [['developmentplans.store'], ['DevelopmentPlan']],
        [['developmentplans.update'], ['DevelopmentPlan']],
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
  Route.resource('evaluationcycledevelopmentplans', 'EvaluationCycleDevelopmentPlanController').apiOnly();

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
  Route.resource('notifications', 'NotificationController').apiOnly();

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

  Route.get('summaryareaemployees/:id', 'SummaryDepartmentEmployeeController.show').middleware([
    'is:(administrator || evaluator)',
  ]);
  Route.get('summaryemployees/:evaluation_cycle_id/:employee_id', 'SummaryEmployeeController.show');
  // .middleware(['is:(administrator || evaluator)']);

  Route.resource('useraccessprofiles', 'UserAccessProfileController').apiOnly();

  Route.resource('usergroups', 'UserGroupController')
    .apiOnly()
    .validator(
      new Map([
        [['usergroups.store'], ['UserGroup']],
        [['usergroups.update'], ['UserGroup']],
      ])
    );

  Route.resource('permissions', 'PermissionController').apiOnly();
  Route.resource('roles', 'RoleController').apiOnly();

  Route.delete('clearemployeeanswers/:id', 'ClearUserQuestionsController.destroy').middleware(['is:(administrator)']);

  Route.get('conciliationlist', 'ConciliationListController.index').middleware(['is:(administrator)']);

  Route.post('results', 'ResultsController.index').middleware(['is:(evaluator)']);

  Route.get('mysituation/:employee_id/:evaluation_cycle_id', 'UserFinishedController.show');

  Route.put('openautoevaluation/:employee_id/:evaluation_cycle_id', 'UserFinishedController.update');

  Route.get('continuousfeedbackareaemployee', 'ContinousFeedbackAreaEmployeesController.index').middleware(['is:(evaluator)']);

  Route.resource('continuousfeedback', 'ContinuousFeedbackController').apiOnly().middleware(['is:(evaluator)']);

  Route.resource('continuousfeedbackdevelopmentplan', 'ContinuousFeedbackDevelopmentPlanController')
    .apiOnly()
    .middleware(['is:(evaluator)']);
}).middleware(['auth']);

// Exemplo de autenticação nas rotas
// Route.get('/app', 'AppController.index').middleware(['auth']);
