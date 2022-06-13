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

  public getUsers(role: string) {
    return this.http.get<User>('https://localhost:9001/admin/users/' + role);
  }

  updateUser(user: User) {
    return this.http.put('https://localhost:9001/admin/users/update', user);
  }

  deleteUser(user: User) {
    return this.http.delete('https://localhost:9001/admin/users/delete/' + user.id);
  }

  addUser(addUser: AddUser) {
    return this.http.post('https://localhost:9001/admin/users/add', addUser);
  }

  resetPassword(user: User) {
    return this.http.put('https://localhost:9001/admin/users/reset', user);
  }

  addRootDir(dirArrayElement: string) {
    return this.http.post('https://localhost:9000/admin/directory/add-user-root/' + dirArrayElement, null);
  }
}
