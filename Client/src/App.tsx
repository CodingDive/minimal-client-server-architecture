import { ReactNode, useState } from "react";
import { useMachine } from "@xstate/react";
import { eventListenerMachine } from "./EventListenerMachine";
import { CuteFactoryAnimation } from "./CuteFactoryAnimation";

const StyledTableHeader = ({ children }: { children: ReactNode }) => (
  <th style={{ padding: "0.7rem", textAlign: "left" }}>{children}</th>
);

const StyledTableDataCell = ({ children }: { children: ReactNode }) => (
  <td
    style={{
      padding: "0.7rem",
      textAlign: "left",
      verticalAlign: "middle",
    }}
  >
    {children}
  </td>
);

const App = () => {
  const [state] = useMachine(eventListenerMachine);

  const { items } = state.context;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "1rem",
      }}
    >
      <h1
        style={{
          color: "#777",
          marginBottom: "3rem",
          marginTop: "1rem",
        }}
      >
        Material factory
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          <CuteFactoryAnimation />
          <p
            style={{
              color: "#666",
              overflowWrap: "break-word",
              marginBottom: "1rem",
            }}
          >
            Animation from https://codepen.io/AleSaenz/pen/XWjgpr
          </p>
        </div>
        <div>
          <table
            style={{
              border: "1px solid #EEE",
              borderCollapse: "collapse",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
            }}
          >
            <thead
              style={{
                width: "100%",
                backgroundColor: "#000",
                color: "white",
              }}
            >
              <tr>
                <StyledTableHeader>Index</StyledTableHeader>
                <StyledTableHeader>Material</StyledTableHeader>
                <StyledTableHeader>Quantity</StyledTableHeader>
                <StyledTableHeader>Lead time</StyledTableHeader>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, leadTime, material, quantity }, index) => (
                <tr
                  key={id}
                  style={{
                    textAlign: "left",
                    backgroundColor:
                      state.context.indexOfHighlightedItemThatChanged === index
                        ? "#90ee90"
                        : index % 2 === 0
                        ? "#d3d3d3"
                        : "white",
                  }}
                >
                  <StyledTableDataCell>{index + 1}</StyledTableDataCell>
                  <StyledTableDataCell>{material}</StyledTableDataCell>
                  <StyledTableDataCell>{quantity}</StyledTableDataCell>
                  <StyledTableDataCell>{leadTime}</StyledTableDataCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
