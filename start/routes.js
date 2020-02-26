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

  Route.post('/behaviors', 'BehaviorController.store').validator('Behavior');
  Route.put('/behaviors/:id', 'BehaviorController.update').validator('Behavior');
  Route.delete('/behaviors/:id', 'BehaviorController.destroy');
  Route.get('/behaviors', 'BehaviorController.index');
  Route.get('/behaviors/:id', 'BehaviorController.show');

  Route.post('/classifications', 'ClassificationController.store').validator('Classification');
  Route.put('/classifications/:id', 'ClassificationController.update').validator('Classification');
  Route.delete('/classifications/:id', 'ClassificationController.destroy');
  Route.get('/classifications', 'ClassificationController.index');
  Route.get('/classifications/:id', 'ClassificationController.show');

  Route.post('/comments', 'CommentController.store').validator('Comment');
  Route.put('/comments/:id', 'CommentController.update').validator('Comment');
  Route.delete('/comments/:id', 'CommentController.destroy');
  Route.get('/comments', 'CommentController.index');
  Route.get('/comments/:id', 'CommentController.show');

  Route.post('/companies', 'CompanyController.store').validator('Company');
  Route.put('/companies/:id', 'CompanyController.update').validator('Company');
  Route.delete('/companies/:id', 'CompanyController.destroy');
  Route.get('/companies', 'CompanyController.index');
  Route.get('/companies/:id', 'CompanyController.show');

  Route.post('/departments', 'DepartmentController.store').validator('Department');
  Route.put('/departments/:id', 'DepartmentController.update').validator('Department');
  Route.delete('/departments/:id', 'DepartmentController.destroy');
  Route.get('/departments', 'DepartmentController.index');
  Route.get('/departments/:id', 'DepartmentController.show');

  Route.post('/developmentplans', 'DevelopmentPlanController.store').validator('DevelopmentPlan');
  Route.put('/developmentplans/:id', 'DevelopmentPlanController.update').validator('DevelopmentPlan');
  Route.delete('/developmentplans/:id', 'DevelopmentPlanController.destroy');
  Route.get('/developmentplans', 'DevelopmentPlanController.index');
  Route.get('/developmentplans/:id', 'DevelopmentPlanController.show');

  Route.post('/evaluationcycleareas', 'EvaluationCycleAreaController.store').validator('EvaluationCycleArea');
  Route.put('/evaluationcycleareas/:id', 'EvaluationCycleAreaController.update').validator('EvaluationCycleArea');
  Route.delete('/evaluationcycleareas/:id', 'EvaluationCycleAreaController.destroy');
  Route.get('/evaluationcycleareas', 'EvaluationCycleAreaController.index');
  Route.get('/evaluationcycleareas/:id', 'EvaluationCycleAreaController.show');

  Route.post('/evaluationcycles', 'EvaluationCycleController.store').validator('EvaluationCycle');
  Route.put('/evaluationcycles/:id', 'EvaluationCycleController.update').validator('EvaluationCycle');
  Route.delete('/evaluationcycles/:id', 'EvaluationCycleController.destroy');
  Route.get('/evaluationcycles', 'EvaluationCycleController.index');
  Route.get('/evaluationcycles/:id', 'EvaluationCycleController.show');

  Route.post('/evaluationcyclelevels', 'EvaluationCycleLevelController.store').validator('EvaluationCycleLevel');
  Route.put('/evaluationcyclelevels/:id', 'EvaluationCycleLevelController.update').validator('EvaluationCycleLevel');
  Route.delete('/evaluationcyclelevels/:id', 'EvaluationCycleLevelController.destroy');
  Route.get('/evaluationcyclelevels', 'EvaluationCycleLevelController.index');
  Route.get('/evaluationcyclelevels/:id', 'EvaluationCycleLevelController.show');

  Route.post('/forms', 'FormController.store').validator('Form');
  Route.put('/forms/:id', 'FormController.update').validator('Form');
  Route.delete('/forms/:id', 'FormController.destroy');
  Route.get('/forms', 'FormController.index');
  Route.get('/forms/:id', 'FormController.show');

  Route.post('/hierarchies', 'HierarchyController.store').validator('Hierarchy');
  Route.put('/hierarchies/:id', 'HierarchyController.update').validator('Hierarchy');
  Route.delete('/hierarchies/:id', 'HierarchyController.destroy');
  Route.get('/hierarchies', 'HierarchyController.index');
  Route.get('/hierarchies/:id', 'HierarchyController.show');

  Route.post('/paths', 'PathController.store').validator('Path');
  Route.put('/paths/:id', 'PathController.update').validator('Path');
  Route.delete('/paths/:id', 'PathController.destroy');
  Route.get('/paths', 'PathController.index');
  Route.get('/paths/:id', 'PathController.show');

  Route.post('/positions', 'PositionController.store').validator('Position');
  Route.put('/positions/:id', 'PositionController.update').validator('Position');
  Route.delete('/positions/:id', 'PositionController.destroy');
  Route.get('/positions', 'PositionController.index');
  Route.get('/positions/:id', 'PositionController.show');

  Route.post('/questions', 'QuestionController.store').validator('Question');
  Route.put('/questions/:id', 'QuestionController.update').validator('Question');
  Route.delete('/questions/:id', 'QuestionController.destroy');
  Route.get('/questions', 'QuestionController.index');
  Route.get('/questions/:id', 'QuestionController.show');

  Route.post('/ratingscales', 'RatingScaleController.store').validator('RatingScale');
  Route.put('/ratingscales/:id', 'RatingScaleController.update').validator('RatingScale');
  Route.delete('/ratingscales/:id', 'RatingScaleController.destroy');
  Route.get('/ratingscales', 'RatingScaleController.index');
  Route.get('/ratingscales/:id', 'RatingScaleController.show');

  Route.post('/skills', 'SkillController.store').validator('Skill');
  Route.put('/skills/:id', 'SkillController.update').validator('Skill');
  Route.delete('/skills/:id', 'SkillController.destroy');
  Route.get('/skills', 'SkillController.index');
  Route.get('/skills/:id', 'SkillController.show');

  Route.put('/users/:id', 'UserController.update').validator('User');
  Route.delete('/users/:id', 'UserController.destroy');
  Route.get('/users', 'UserController.index');
  Route.get('/users/:id', 'UserController.show');

  Route.post('/usergroups', 'UserGroupController.store').validator('UserGroup');
  Route.put('/usergroups/:id', 'UserGroupController.update').validator('UserGroup');
  Route.delete('/usergroups/:id', 'UserGroupController.destroy');
  Route.get('/usergroups', 'UserGroupController.index');
  Route.get('/usergroups/:id', 'UserGroupController.show');
}).middleware(['auth']);

// Exemplo de autenticação nas rotas
// Route.get('/app', 'AppController.index').middleware(['auth']);
