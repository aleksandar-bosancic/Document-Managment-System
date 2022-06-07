import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {User} from "../../model/user";
import {Observable} from "rxjs";
import {UserService} from "../services/user.service";
import {Attribute} from "../../model/attribute";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";
import {AddUser} from "../../model/add-user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public clients: User[] = [];
  public selectedUser = new SelectionModel<User>(false, []);
  public documentAdmins: User[] = [];
  clientFormGroup: FormGroup = new FormGroup({});
  displayedColumns = ['username', 'firstName', 'lastName', 'email'];

  constructor(private keycloakService: KeycloakService, private service: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loadClients()
    this.selectedUser.changed.subscribe(s => this.userSelected())
    this.clientFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      username: [null],
      firstName: [null],
      lastName: [null],
      email: [null],
      rootDirectory: [null],
      allowedDomains: [null]
    })
  }

  loadClients() {
    this.service.getUsers().subscribe((result: any) => {
      const data = result.map((element: any) => {

        let attribute: Attribute = new Attribute(element.attributes.rootDirectory, element.attributes.allowedDomains);

        return new User(element.id, element.username, element.firstName, element.lastName, element.email, attribute);
      });
      this.clients = data;
    });
  }

  delete() {
    if (this.selectedUser.selected[0] != null) {
      this.service.deleteUser(this.selectedUser.selected[0]).subscribe();
      this.loadClients();
    } else {
      alert('User not selected.');
    }
  }

  update() {
    if (this.selectedUser.selected[0] != null) {
      this.service.updateUser(this.selectedUser.selected[0]).subscribe();
      this.loadClients();
    } else {
      alert('User not selected.');
    }
  }

  clear() {
    this.clientFormGroup.reset();
    this.selectedUser.clear();
  }

  userSelected(): void {
    let selected = this.selectedUser.selected[0];
    console.log(selected)
    let form = this.clientFormGroup;
    if (selected == null) {
      form.reset();
      return;
    }
    form.reset();
    form.controls['id'].setValue(selected.id);
    form.controls['username'].setValue(selected.username);
    form.controls['firstName'].setValue(selected.firstName);
    form.controls['lastName'].setValue(selected.lastName);
    form.controls['email'].setValue(selected.email);
    form.controls['rootDirectory'].setValue(selected.attributes.rootDirectory[0]);
    if (selected.attributes.allowedDomains == null) {
      return;
    }
    let domains = selected.attributes.allowedDomains;
    let domainsString = "";
    domains.forEach(domain => {
      domainsString += domain + '\n';
    });
    form.controls['allowedDomains'].setValue(domainsString);
  }

  add(role: string) {
    let form = this.clientFormGroup;
    let username = form.controls['username'].value;
    let firstName = form.controls['firstName'].value;
    let lastName = form.controls['lastName'].value;
    let email = form.controls['email'].value;
    let rootDirectory = form.controls['rootDirectory'].value;
    let allowedDomains = form.controls['allowedDomains'].value;
    // if (this.selectedUser.selected[0] != null) {
    //   alert('Can not add user while existing user is selected.');
    //   return;
    // }
    if (username == null || username === '' || firstName == null || firstName === ''
      || lastName == null || lastName === '' || email == null || email === '' || rootDirectory == null
      || rootDirectory === '') {
      alert('User data can not be empty.');
      return;
    }
    let domainsArray = [];
    let rootDirArray = [];
    rootDirArray[0] = rootDirectory;
    if (allowedDomains != null || allowedDomains != ''){
      domainsArray = allowedDomains.trim().split(/[\r\n]+/);
    }
    let attributes = new Attribute(rootDirArray, domainsArray);
    this.service.addUser(new AddUser(username, firstName, lastName, email, role, attributes)).subscribe();
  }
}
