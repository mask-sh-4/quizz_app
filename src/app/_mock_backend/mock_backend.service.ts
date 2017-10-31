import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { environment } from '../../environments/environment';

export function fakeBackendFactory (backend: MockBackend, options: BaseRequestOptions) {
  const storage = window.localStorage;
  backend.connections.subscribe((c: MockConnection) => {

    // ADD quiz
    if (c.request.url === `${environment.host}${environment.quiz}` && c.request.method === 1) {
      const data = JSON.parse(c.request.getBody()),
            name = data.name;
      let products = JSON.parse(storage.getItem('quizzes')) || [];
      products.push(data);
      products = JSON.stringify(products);
      storage.setItem('quizzes', products);
      c.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(name)
      })));
    }

    // GET Quizzes
    if (c.request.url === `${environment.host}${environment.quiz}` && c.request.method === 0) {
      const data = JSON.parse(storage.getItem('quizzes')) || [];
      c.mockRespond(new Response(new ResponseOptions({
        body: data
      })));
    }

    // DELETE Quiz
    if (c.request.url === `${environment.host}${environment.delete_quiz}` && c.request.method === 1) {
      const data = JSON.parse(storage.getItem('quizzes')),
        id = +c.request.getBody();
      let name = '',
        index = 0;
      data.forEach((item, i) =>  {
        if (item._id === id) {
          name = item.name;
          index = i;
          return false;
        }
      });
      data.splice(index, 1);
      storage.removeItem('quizzes');
      storage.setItem('quizzes', JSON.stringify(data));
      c.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(name)
      })));
    }

    // GET Quiz
    if (c.request.url === `${environment.host}${environment.get_quiz}` && c.request.method === 1) {
      const data = JSON.parse(storage.getItem('quizzes')),
        id = +c.request.getBody();
      const product = data.filter((item) =>  {
        if (item._id === id)  {
          return item;
        }
      });
      c.mockRespond(new Response(new ResponseOptions({
        body: product
      })));
    }

    // EDIT Quiz
    if (c.request.url === `${environment.host}${environment.quiz}` && c.request.method === 2) {
      const data = JSON.parse(storage.getItem('quizzes')),
        product = JSON.parse(c.request.getBody()),
        name = product.name;
      const new_data = data.map((item, i) =>  item._id === product._id ? product : item );
      storage.removeItem('quizzes');
      storage.setItem('quizzes', JSON.stringify(new_data));
      c.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(name)
      })));
    }

    // SAVE RESULT
    if (c.request.url === `${environment.host}${environment.save_result_quiz}` && c.request.method === 1) {
      const db = JSON.parse(storage.getItem('quizzes')),
         data = JSON.parse(c.request.getBody()),
        _id = data._id;
      let quiz = db.filter((item) =>  {
        if (item._id === _id)  {
          return item;
        }
      });
      quiz[0].passed.push({time: data.time, all_answers: data.all_answers});
      storage.removeItem('quizzes');
      storage.setItem('quizzes', JSON.stringify(db));
      c.mockRespond(new Response(new ResponseOptions({
        body: 1
      })));
    }

    // ADD log
    if (c.request.url === `${environment.host}${environment.log}` && c.request.method === 1) {
      const data = JSON.parse(c.request.getBody()),
        name = data.name;
      let products = JSON.parse(storage.getItem('logs')) || [];
      products.push(data);
      products = JSON.stringify(products);
      storage.setItem('logs', products);
      c.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(name)
      })));
    }

    // GET logs
    if (c.request.url === `${environment.host}${environment.log}` && c.request.method === 0) {
      const data = JSON.parse(storage.getItem('logs')) || [];
      c.mockRespond(new Response(new ResponseOptions({
        body: data
      })));
    }

});
  return new Http(backend, options);
}

export let fakeBackendProvider = {
  provide: Http,
  useFactory: fakeBackendFactory ,
  deps: [MockBackend, BaseRequestOptions]
};
