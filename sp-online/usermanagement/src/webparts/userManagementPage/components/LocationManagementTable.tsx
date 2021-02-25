import * as React from "react";
import {IUserManagementPageProps} from "./IUserManagementPageProps";
import styles from "./UserManagementPage.module.scss";
import {Button, DefaultButton, PrimaryButton} from "office-ui-fabric-react/lib/Button";
import {DetailsList, DetailsListLayoutMode, Dialog, DialogFooter, TextField} from "office-ui-fabric-react";
import {Selection, SelectionMode} from "office-ui-fabric-react/lib/DetailsList";

export interface ILocationManagementTableState {
  columns: any;
  items: any;
  hideDialog: any;
  toggleHideDialog: any;
  newLocationName: string;
  selectedItemId: any;
}
export default class LocationManagementTable extends React.Component<{}, ILocationManagementTableState> {
  public items = [];
  public columns = [];

  public locationsEndpoint = 'https://usermanagement20210220203508.azurewebsites.net';
  public functionKey = '8gu0iHP6JrCf56BnJ/zO75vsCNBVa0b/2yg9HHthysnDBS0McHlBGw==';

  private httpHeaders = {
    headers:{
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
        key: 'name',
        name: 'Name',
        width: 140,
        onRender: (item) => (
          <span>{item.name}</span>
        )
      },
      {
        key: 'users',
        name: 'Users',
        width: 140,
        onRender: (item) => (
          <span>{item.users}</span>
        )
      }
    ];

    this.state = {
      items: this.items,
      columns: this.columns,
      hideDialog: true,
      toggleHideDialog: false,
      newLocationName: '',
      selectedItemId: null
    };
  }

  public componentDidMount() {
    fetch(this.locationsEndpoint + '/api/locations?code=' + this.functionKey, this.httpHeaders)
      .then(res => res.json())
      .then((result) => {
        this.items = result;
        this.setState({
          items: result
        });
      });
  }

  public open = () => this.setState({hideDialog: false});
  public close = () => this.setState({hideDialog: true});

  public addLocation = () => {
    fetch(this.locationsEndpoint + '/api/locations/add?code=' + this.functionKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.newLocationName,
      })
    })
      .then(res => res.json())
      .then((result) => {
        this.items.push(result);
        this.setState({
          items: this.items.concat()
        });
      });
    this.close();
  }

  public removeLocation = () => {
    fetch(this.locationsEndpoint + '/api/locations/delete?code=' + this.functionKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.selectedItemId
      })
    })
      .then((result) => {
        if(result.status == 403){
          alert("You cannot delete this location, because it contains references to existing users.");
        }
        else{
          this.items = this.items.filter(x => x.id !== this.state.selectedItemId);
          this.setState({
            items: this.items.concat(),
          });
        }
      });
  }

  public render(): React.ReactElement<IUserManagementPageProps> {

    const {columns, items, hideDialog, toggleHideDialog, newLocationName} = this.state;

    return (
      <>
        <div className={styles.outerContainer}>
          <div className={styles.userManagementPage}>
            <div className={styles.container}>
              <div className={styles.buttonsRow}>
                <DefaultButton onClick={this.open}>Add Location</DefaultButton>
                <Button onClick={this.removeLocation}
                        disabled={this.selection.getSelectedCount() < 1}>Remove Location</Button>
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
          <TextField label={'Location'} onChanged={e => {this.setState({newLocationName: e});}} />
          <DialogFooter>
            <PrimaryButton onClick={this.addLocation} text="Add" />
            <DefaultButton onClick={this.close} text="Close" />
          </DialogFooter>
        </Dialog>
      </>
    );
  }
}
