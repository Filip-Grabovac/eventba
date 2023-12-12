import React from "react";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import DataGrid, {
  Column,
  Editing,
  Pager,
  SearchPanel,
  Popup,
  Lookup,
  Paging,
  Export,
  FilterRow,
  HeaderFilter,
  Form,
} from "devextreme-react/data-grid";

import axios from "axios";
import { toastSetup } from "../../../../functions/toastSetup";
import { toast } from "react-toastify";

import { exportDataGrid } from "devextreme/excel_exporter";
import { Item } from "devextreme-react/form";

const allowedPageSizes = [5, 10, 15];
class DevExpress extends React.Component {
  isCompactMode() {
    return this.state.displayMode === "compact";
  }

  constructor(props) {
    super(props);
    this.state = {
      showPageSizeSelector: true,
      showInfo: true,
      showNavButtons: true,
    };
    this.onExporting = this.onExporting.bind(this);
  }

  render() {
    const { data } = this.props;

    return (
      <>
        <h6>Pretraži korisnike</h6>
        <div id="data-grid-demo">
          <DataGrid
            allowColumnResizing={true}
            columnResizingMode={"nextColumn"}
            dataSource={data}
            keyExpr="_id"
            showBorders={true}
            onExporting={this.onExporting}
            onRowUpdated={this.onRowUpdated}
            onRowInserted={this.onRowInserted}
            onRowRemoved={this.onRowRemoved}
          >
            <SearchPanel visible={true} placeholder="Pretraži . . ." />
            <Paging defaultPageSize={10} />
            <Pager
              visible={true}
              allowedPageSizes={allowedPageSizes}
              displayMode={this.state.displayMode}
              showPageSizeSelector={this.state.showPageSizeSelector}
              showInfo={this.state.showInfo}
              showNavigationButtons={this.state.showNavButtons}
            />
            <Editing
              mode="popup"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              useIcons={true}
            >
              <Popup title="Ažuriraj podatke" showTitle={true} />
              <Form>
                <Item itemType="group" colCount={2} colSpan={2}>
                  <Item dataField="full_name" />
                  <Item dataField="email" />
                  <Item dataField="phone" />
                  <Item dataField="city" />
                  <Item dataField="address" />
                  <Item dataField="zip" />
                  <Item dataField="country" />
                  <Item dataField="role" />
                  <Item dataField="newsletter" />
                  <Item dataField="is_verified" />
                </Item>
              </Form>
            </Editing>
            <Column
              dataField="full_name"
              caption="Ime i prezime"
              minWidth={120}
            />
            <Column dataField="email" minWidth={120} />
            <Column dataField="phone" caption="Mobitel" />
            <Column dataField="city" caption="Grad" />
            <Column dataField="address" caption="Adresa" />
            <Column dataField="country" caption="Država" />
            <Column dataField="is_verified" caption="Verificiran" />
            <Column dataField="newsletter" visible={true} />
            <Column dataField="password" caption="Lozinka" visible={false} />
            <Column dataField="zip" caption="Zip" visible={false} />
            <Column dataField="role" caption="Tip računa">
              <Lookup
                dataSource={[
                  { value: "admin", display: "Admin" },
                  { value: "organizer", display: "Organizator" },
                  { value: "reseller", display: "Preprodavač" },
                  { value: "standard", display: "Standard" },
                ]}
                valueExpr="value"
                displayExpr="display"
              />
            </Column>
            <FilterRow visible={true} applyFilter="auto" />
            <HeaderFilter></HeaderFilter>
            <Export enabled={true} allowExportSelectedData={false} />
          </DataGrid>
        </div>
      </>
    );
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Glavna stranica");

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Korisnici.xlsx"
        );
      });
    });
  }
  onRowUpdated = async (e) => {
    // The edited data is available in e.data after the row is updated
    const editedData = e.data;

    const { token } = this.props;
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/${editedData._id}`;
    try {
      await axios.patch(
        apiUrl,
        { user: editedData, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Uspješno ste ažurirali podatke",
        toastSetup("top-right", 2000)
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
      }

      const errorMessage =
        error.response?.data?.message || "Nepoznata pogreška.";
      toast.error(
        `Došlo je do pogreške prilikom ažuriranja podataka. ${errorMessage}!`,
        toastSetup("top-center", 4000)
      );
    }
  };
  onRowInserted = async (e) => {
    // Novi korisnik je dostupan u e.data nakon što je red dodan
    const newUser = e.data;
    const { token } = this.props;
    try {
      // Logika za dodavanje novog korisnika na server

      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users`, {
        user: { ...newUser, password: "" },
        token,
      });

      toast.success(
        "Uspješno ste dodali novog korisnika",
        toastSetup("top-right", 2000)
      );
    } catch (error) {
      // Obrada grešaka ako je potrebno
      const errorMessage =
        error.response?.data?.message || "Nepoznata pogreška.";
      toast.error(
        `Došlo je do pogreške prilikom dodavanja novog korisnika. ${errorMessage}!`,
        toastSetup("top-center", 4000)
      );
    }
  };

  onRowRemoved = async (e) => {
    // Podaci o obrisanom korisniku dostupni su u e.data nakon što je red obrisan
    const deletedUser = e.data;
    const { token } = this.props;

    try {
      axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/users/delete_user/${deletedUser._id}`,
        {
          data: { token }, // Send the token in the request body
          headers: {
            "Content-Type": "application/json", // Set the content type if needed
            // Other headers as needed
          },
        }
      );
      toast.success(
        "Uspješno ste obrisali korisnika",
        toastSetup("top-right", 2000)
      );
    } catch (error) {
      // Obrada grešaka ako je potrebno
      if (error.response && error.response.status === 401) {
      }

      const errorMessage =
        error.response?.data?.message || "Nepoznata pogreška.";
      toast.error(
        `Došlo je do pogreške prilikom brisanja korisnika. ${errorMessage}!`,
        toastSetup("top-center", 4000)
      );
    }
  };
}

export default DevExpress;
