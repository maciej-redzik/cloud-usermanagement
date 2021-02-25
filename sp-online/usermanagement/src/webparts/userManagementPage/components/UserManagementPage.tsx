import * as React from 'react';
import UserManagementTable from "./UserManagementTable";
import LocationManagementTable from "./LocationManagementTable";

export default class UserManagementPage extends React.Component<{}> {

  public render(): React.ReactElement<any> {
    return (
      <>
        <UserManagementTable />
        <LocationManagementTable  />
      </>
    );
  }
}
