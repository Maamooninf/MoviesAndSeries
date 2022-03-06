import UserController from './routes/userrout.js'
import MovieController from './routes/movierout.js'
import App from './initialapp/App.js'
import ListController from './routes/listrout.js'
import CoversationController from './routes/Conversarout.js';
import MessageController from './routes/Messagerout.js'
const app = new App(
    [
      new UserController(),
      new MovieController(),
      new ListController(),
      new CoversationController(),
      new MessageController()
    ],    5000,
   );
  

  app.listen();