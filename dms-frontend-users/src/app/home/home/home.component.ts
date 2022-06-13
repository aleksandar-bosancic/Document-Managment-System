import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {User} from "../../model/user";
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
  public selectedUser = new SelectionModel<User>(false, []);
  public selectedActions = new SelectionModel<string>(true, []);
  public selectedRole = new SelectionModel<string>(false, []);

  public clients: User[] = [];
  public documentAdmins: User[] = [];
  public systemAdmins: User[] = [];

  public selectedUserList: User[] = [];
  public dataSource: User[] = [];

  public userRoles: string[] = ['application-client', 'application-document-admin', 'application-system-admin'];
  public userActions: string[] = ['download', 'edit','remove', 'upload'];
  public displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email'];

  clientFormGroup: FormGroup = new FormGroup({});

  constructor(private keycloakService: KeycloakService, private service: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loadUsers()
    this.selectedUser.changed.subscribe(s => this.userSelected())
    this.selectedActions.changed.subscribe();
    this.selectedRole.changed.subscribe(s => this.roleChanged(s.source.selected[0]));
    this.clientFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      username: [null],
      firstName: [null],
      lastName: [null],
      email: [null],
      rootDirectory: [null],
      domainInput: [null],
      actions: [null]
    })
  }

  loadUsers() {
    this.service.getUsers('client').subscribe((result: any) => {
      this.clients = result.map((element: any) => {
        let attribute: Attribute = new Attribute(element.attributes?.rootDirectory, element.attributes?.allowedDomains, element.attributes?.actions);
        return new User(element.id, element.username, element.firstName, element.lastName, element.email, attribute);
      });
    });
    this.service.getUsers('system-admin').subscribe((result: any) => {
      this.systemAdmins = result.map((element: any) => {
        let attribute: Attribute = new Attribute(element.attributes?.rootDirectory, element.attributes?.allowedDomains, element.attributes?.actions);
        return new User(element.id, element.username, element.firstName, element.lastName, element.email, attribute ?? null);
      });
    });
    this.service.getUsers('document-admin').subscribe((result: any) => {
      this.documentAdmins = result.map((element: any) => {
        let attribute: Attribute = new Attribute(element.attributes?.rootDirectory, element.attributes?.allowedDomains, element.attributes?.actions);
        return new User(element.id, element.username, element.firstName, element.lastName, element.email, attribute ?? null);
      });
    });
  }

  delete() {
    if (this.selectedUser.selected[0] != null) {
      this.service.deleteUser(this.selectedUser.selected[0]).subscribe();
      this.loadUsers();
    } else {
      alert('User not selected.');
    }
  }

  update() {
    if (this.selectedUser.selected[0] != null) {
      if (!this.isUserDataEmpty()) {
        alert('User data can not be empty.');
        return;
      }
      let user: User = this.selectedUser.selected[0];
      let form = this.clientFormGroup;
      user.username = form.controls['username'].value;
      user.firstName = form.controls['firstName'].value;
      user.lastName = form.controls['lastName'].value;
      user.email = form.controls['email'].value;
      let rootDirectory = form.controls['rootDirectory'].value;
      let allowedDomain = form.controls['domainInput'].value;
      let actions = form.controls['actions'].value;
      if (rootDirectory != null){
        if (!!rootDirectory[0]) {
          let dirArray= [];
          dirArray[0] = rootDirectory;
          user.attributes.rootDirectory = dirArray;
          this.service.addRootDir(dirArray[0]).subscribe();
        }
      }
      if (!!allowedDomain[0]){
        let domainsArray = [];
        domainsArray[0] = allowedDomain;
        user.attributes.allowedDomains = domainsArray;
      }
      if (actions){
        user.attributes.actions = actions;
      }
      this.service.updateUser(this.selectedUser.selected[0]).subscribe();
      this.clear();
      this.loadUsers();
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
    let form = this.clientFormGroup;
    if (selected == null) {
      form.reset();
      form.controls['username'].enable();
      return;
    }
    form.reset();
    form.controls['id'].setValue(selected.id);
    form.controls['username'].setValue(selected.username);
    form.controls['username'].disable();
    form.controls['firstName'].setValue(selected.firstName);
    form.controls['lastName'].setValue(selected.lastName);
    form.controls['email'].setValue(selected.email);
    if (selected.attributes.rootDirectory != undefined) {
      form.controls['rootDirectory'].setValue(selected.attributes.rootDirectory[0]);
    }
    if (selected.attributes.allowedDomains != undefined) {
      form.controls['domainInput'].setValue(selected.attributes.allowedDomains[0]);
    }
    if (selected.attributes.actions != undefined) {
      let actions = selected.attributes.actions;
      this.selectedActions.select(...actions);
      form.controls['actions'].setValue(actions);
    }
  }

  isUserDataEmpty(): boolean {
    let form = this.clientFormGroup;
    return !(form.controls['username'].value == null || form.controls['username'].value === '' ||
      form.controls['firstName'].value == null || form.controls['firstName'].value === '' ||
      form.controls['lastName'].value == null || form.controls['lastName'].value === '' ||
      form.controls['email'].value == null || form.controls['email'].value === '');
  }

  add() {
    let form = this.clientFormGroup;
    let username = form.controls['username'].value;
    let firstName = form.controls['firstName'].value;
    let lastName = form.controls['lastName'].value;
    let email = form.controls['email'].value;
    let rootDirectory = form.controls['rootDirectory'].value;
    let allowedDomains = form.controls['domainInput'].value;
    let actions = form.controls['actions'].value;
    if (this.selectedUser.selected[0] != null) {
      alert('Can not add user while existing user is selected.');
      return;
    }
    if (!this.isUserDataEmpty()) {
      alert('User data can not be empty.');
      return;
    }
    if (this.selectedRole.selected[0] == null) {
      alert('Select user role.');
      return;
    }
    let role = this.selectedRole.selected;
    let domainsArray = [];
    let rootDirArray = [];
    let actionsArray = actions;
    rootDirArray[0] = rootDirectory;
    domainsArray[0] = allowedDomains;
    let attributes = new Attribute(rootDirArray, domainsArray, actionsArray);
    this.service.addUser(new AddUser(username, firstName, lastName, email, role, attributes)).subscribe();
    if (rootDirectory != null && rootDirectory != ''){
      this.service.addRootDir(rootDirectory).subscribe();
    }
  }

  roleChanged(role: string) {
    switch (role) {
      case 'application-client':
        this.selectedUserList = this.clients;
        this.dataSource = this.clients;
        this.clientFormGroup.get('actions')?.enable()
        this.clientFormGroup.get('domainInput')?.enable()
        this.clientFormGroup.get('rootDirectory')?.enable()
        break;
      case 'application-document-admin':
        this.selectedUserList = this.documentAdmins;
        this.dataSource = this.documentAdmins;
        this.clientFormGroup.get('actions')?.disable()
        this.clientFormGroup.get('domainInput')?.disable()
        this.clientFormGroup.get('rootDirectory')?.enable()
        break;
      case 'application-system-admin':
        this.selectedUserList = this.systemAdmins;
        this.dataSource = this.systemAdmins;
        this.clientFormGroup.get('actions')?.disable()
        this.clientFormGroup.get('domainInput')?.disable()
        this.clientFormGroup.get('rootDirectory')?.disable()
        break;
    }
    this.clientFormGroup.reset();
    this.selectedUser.clear();
  }

  applyFilter(target: any) {
    let filter = (target as HTMLInputElement).value;
    this.dataSource = this.selectedUserList;
    this.dataSource = this.selectedUserList.filter((user: User) => user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.firstName.toLowerCase().includes(filter.toLowerCase()) || user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()));
  }

  resetPassword() {
    if (this.selectedUser.selected[0] == null) {
      alert('User not selected.')
      return;
    }
    this.service.resetPassword(this.selectedUser.selected[0]).subscribe();
  }
}
