console.log('Server starting...');
const startTime = new Date().getTime();
import App from '@/app';
console.log(`Time for loading app: ${new Date().getTime() - startTime} ms`);
import IndexRoute from '@routes/index.route';
import CardRoute from './routes/card.route';
console.log(`Time for loading Card route: ${new Date().getTime() - startTime} ms`);
import TopicRoute from './routes/topic.route';
console.log(`Time for loading Topic route: ${new Date().getTime() - startTime} ms`);
import validateEnv from '@utils/validateEnv';
console.log(`Time for loading validate env: ${new Date().getTime() - startTime} ms`);

validateEnv();

const app = new App([new IndexRoute(), new CardRoute(), new TopicRoute()]);
// const app = new App([]);

app.listen();
const endTime = new Date().getTime();
console.log(`Server started in ${endTime - startTime} ms`);

app.io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.disconnect();
  });
});

export default app;
