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
