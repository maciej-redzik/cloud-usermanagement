import * as React from "react";
import {IUserManagementPageProps} from "./IUserManagementPageProps";
import styles from "./UserManagementPage.module.scss";
import {Button, DefaultButton, PrimaryButton} from "office-ui-fabric-react/lib/Button";
import {
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  Dropdown,
  TextField,
} from "office-ui-fabric-react";
import { Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';

export interface IUserManagementTableState {
  columns: any;
  items: any;
  locations: any;
  hideDialog: any;
  toggleHideDialog: any;
  newUserFirstName: string;
  newUserLastName: string;
  newUserPhone: string;
  newUserLocationId: number;
  selectedItemId: any;
}

export default class UserManagementTable extends React.Component<{}, IUserManagementTableState> {

  public items = [];
  public locations = [];
  public columns = [];
  public usersEndpoint = 'https://usermanagement20210220203508.azurewebsites.net';
  public functionKey = '8gu0iHP6JrCf56BnJ/zO75vsCNBVa0b/2yg9HHthysnDBS0McHlBGw==';
  public callInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  private selection: Selection;
  private _onItemsSelectionChanged = () => {
    if(this.selection && this.selection.getSelectedCount() > 0){
      console.log(this.selection.getSelection()[0]["id"]);
      this.setState( {
        selectedItemId: this.selection.getSelection()[0]["id"]
      });
    }
  }

  constructor(props: {}) {
    super(props);

    this.selection = new Selection({
      onSelectionChanged: this._onItemsSelectionChanged
    });

    this.columns = [
      {
        key: 'firstName',
        name: 'First Name',
        width: 140,
        onRender: (item) => (
          <span>{item.firstName}</span>
        )
      },
      {
        key: 'lastName',
        name: 'Last Name',
        width: 140,
        onRender: (item) => (
          <span>{item.lastName}</span>
        )
      },
      {
        key: 'phone',
        name: 'Phone',
        width: 140,
        onRender: (item) => (
          <span>{item.phone}</span>
        )
      },
      {
        key: 'location',
        name: 'Location',
        width: 140,
        onRender: (item) => (
          <span>{item.location}</span>
        )
      }
    ];
    this.items = [];
    this.locations = [];

    this.state = {
      items: this.items,
      locations: this.locations,
      columns: this.columns,
      hideDialog: true,
      toggleHideDialog: false,
      newUserFirstName: '',
      newUserLastName: '',
      newUserPhone: '',
      newUserLocationId: -1,
      selectedItemId: null
    };
  }

  public componentDidMount() {
    //Get Users for table
    fetch(this.usersEndpoint + '/api/users?code=' + this.functionKey, this.callInit)
      .then(res => res.json())
      .then((result) => {
        this.items = result;
        this.setState({
          items: result
        });
      });
    //Get list of locations for dropdown menu in dialog
    fetch(this.usersEndpoint + '/api/locations?code=' + this.functionKey, this.callInit)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          locations: result
        });
      });
  }

  public open = () => this.setState({hideDialog: false});
  public close = () => this.setState({hideDialog: true});

  public addUser = () => {
    fetch(this.usersEndpoint + '/api/users/add?code=' + this.functionKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.state.newUserFirstName,
        lastName: this.state.newUserLastName,
        phone: this.state.newUserPhone,
        locationId: this.state.newUserLocationId
      })
    })
      .then(res => res.json())
      .then((result) => {
        this.items.push(result);
        this.setState({
          items: this.items.concat()
        });
      });

    this.setState({newUserFirstName: '', newUserLastName: '', newUserPhone: '', newUserLocationId: -1});
    this.close();
  }

  public removeUser = () => {
    fetch(this.usersEndpoint + '/api/users/delete?code=' + this.functionKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.selectedItemId
      })
    })
      .then(() => {
        this.items = this.items.filter(x => x.id !== this.state.selectedItemId);
        this.setState({
          items: this.items.concat(),
        });
      });
  }

  public render(): React.ReactElement<IUserManagementPageProps> {

    const {columns, items, hideDialog, toggleHideDialog,
      newUserFirstName, newUserLastName, newUserLocationId, newUserPhone,
      selectedItemId} = this.state;

    return (
      <>
        <div className={styles.outerContainer}>
          <div className={styles.userManagementPage}>
            <div className={styles.container}>
              <span className={styles.title}>User Management App</span>
              <p className={styles.subTitle}>User management Single-page-app with react & Fluent UI.</p>
              <div className={styles.buttonsRow}>
                <DefaultButton onClick={this.open}>Add User</DefaultButton>
                <Button onClick={this.removeUser} disabled={this.selection.getSelectedCount() < 1}>Remove User</Button>
              </div>
              <DetailsList
                columns={columns}
                items={items}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                isHeaderVisible={true}
                className={styles.detailsList}
                selection={this.selection}
                selectionMode={SelectionMode.single}
              />
            </div>
          </div>
        </div>

        <Dialog
          hidden={hideDialog}
          onDismiss={this.close}
          dialogContentProps={items}
          modalProps={{isBlocking: false, topOffsetFixed: true}}>
          <TextField label={'First name'} onChanged={e => {this.setState({newUserFirstName: e});}} />
          <TextField label={'Last name'} onChanged={e => {this.setState({newUserLastName: e});}} />
          <TextField label={'Phone'} onChanged={e => {this.setState({newUserPhone: e});}} />
          <br/>
          <Dropdown placeholder="Select Location" onChanged={e => {this.setState({newUserLocationId: e.key as number});}}
                    options={this.state.locations.map(location => ({ key: location.id, text: location.name }))} />
          <DialogFooter>
            <PrimaryButton onClick={this.addUser} text="Add" />
            <DefaultButton onClick={this.close} text="Close" />
          </DialogFooter>
        </Dialog>
      </>
    );
  }

}
