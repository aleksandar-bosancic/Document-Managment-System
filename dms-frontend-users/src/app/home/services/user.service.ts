import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {AddUser} from "../../model/add-user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public getUsers() {
    return this.http.get<User>('https://localhost:9001/admin/users/client');
  }

  updateUser(user: User) {
    return this.http.get('https://localhost:9001/admin/users/update');
  }

  deleteUser(user: User) {
    const csrfToken = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$|^.*$/, '$1');
    return this.http.delete('https://localhost:9001/admin/users/delete/' + user.id, {headers: {'X-XSRF-TOKEN': csrfToken}});
  }

  addUser(addUser: AddUser) {
    const csrfToken = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/, '$1');
    // console.log(csrfToken)
    return this.http.post('https://localhost:9001/admin/users/add', addUser, {headers: {'X-XSRF-TOKEN': csrfToken}});
  }
}
