import React from "react";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import DataGrid, {
  Column,
  Pager,
  SearchPanel,
  Item,
  Toolbar,
  Paging,
  Export,
  FilterRow,
  HeaderFilter,
  Editing,
  Selection,
} from "devextreme-react/data-grid";
import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";

import { Button } from "devextreme-react/button";

import { exportDataGrid } from "devextreme/excel_exporter";

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
      selectedRowKeys: [],
      data: props.tickets || [], // Initialize with the initial data
    };
    this.onExporting = this.onExporting.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
    this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Compare previous and current props to check if tickets have changed
    if (prevProps.tickets !== this.props.tickets) {
      this.setState({
        data: this.props.tickets || [], // Update the data state with new tickets
      });
    }
  }

  render() {
    const ticketColumns = [
      { dataField: "ID", caption: "ID", width: 45 },
      { dataField: "performer_name", caption: "Izvođač" },
      { dataField: "category", caption: "Kategorija", minWidth: 50 },
      { dataField: "ticket_type", caption: "Vrsta ulaznice" },
      { dataField: "price", caption: "Cijena", width: 60 },
      {
        dataField: "sent_on_email",
        caption: "Poslano na email",
        minWidth: 130,
      },
      { dataField: "owner", caption: "Vlasnik" },
      { dataField: "isValid", caption: "Validna", minWidth: 50 },
    ];

    return (
      <>
        <div id="data-grid-demo">
          <DataGrid
            allowColumnResizing={true}
            columnResizingMode={"widget"}
            dataSource={this.state.data}
            keyExpr="_id"
            showBorders={true}
            onExporting={this.onExporting}
            onRowUpdated={this.onRowUpdated}
            onSelectionChanged={this.selectionChanged}
          >
            <Paging defaultPageSize={10} />
            <Pager
              visible={true}
              allowedPageSizes={allowedPageSizes}
              displayMode={this.state.displayMode}
              showPageSizeSelector={this.state.showPageSizeSelector}
              showInfo={this.state.showInfo}
              showNavigationButtons={this.state.showNavButtons}
            />
            <Selection mode="multiple" />
            <Editing mode="cell" allowUpdating={true} />
            {ticketColumns.map((column) => (
              <Column
                key={column.dataField}
                dataField={column.dataField}
                caption={column.caption}
                minWidth={column.minWidth}
                width={column.width}
                cellRender={column.cellRender}
              />
            ))}
            <FilterRow visible={true} applyFilter="auto" />
            <HeaderFilter></HeaderFilter>
            <Export enabled={true} allowExportSelectedData={false} />
            <Toolbar>
              <Item location="after">
                <Button
                  onClick={this.deleteSelectedRows}
                  icon="trash"
                  text="Delete Selected Rows"
                />
              </Item>
            </Toolbar>
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

    const { token, concertId } = this.props;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/tickets/tickets_for_${concertId}/${editedData._id}`,
        { token }
      );
      toast.success(
        "Uspješno ste promjenili validnost ulaznice!",
        toastSetup("top-right", 2000)
      );
    } catch (error) {
      toast.error(error.response.data.msgInfo, toastSetup("top-center", 3000));
    }
  };

  selectionChanged(e) {
    this.setState({
      selectedRowKeys: e.selectedRowKeys,
    });
  }

  async deleteSelectedRows() {
    const { selectedRowKeys, data } = this.state;

    if (selectedRowKeys.length === 0) {
      // No rows selected, handle accordingly (show a message or return)
      return;
    }

    const { token, concertId } = this.props;

    try {
      // Send a request to delete selected tickets
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/tickets/tickets_for_${concertId}/delete`,
        {
          data: { token, ticketIds: selectedRowKeys },
        }
      );

      // Update the state to trigger a re-render and refresh the data
      this.setState({
        selectedRowKeys: [],
        data: data.filter((row) => !selectedRowKeys.includes(row._id)),
      });

      toast.success(
        "Uspješno ste obrisali ulaznice!",
        toastSetup("top-right", 2000)
      );
    } catch (error) {
      // Handle errors more effectively
      console.error("Error deleting tickets:", error);
      toast.error(
        error.response?.data?.msgInfo || "An error occurred",
        toastSetup("top-center", 3000)
      );
    }
  }
}

export default DevExpress;
