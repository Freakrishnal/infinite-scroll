import React, { useEffect, useState, useMemo } from "react";
import { useTable } from "react-table";
import { FixedSizeList as List } from "react-window";

const InfiniteScrollTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadMoreData = async () => {
      setLoading(true);
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      const newData = await response.json();
      setData((oldData) => [...oldData, ...newData.results]);
      setLoading(false);
    };

    loadMoreData();
  }, [page]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Species",
        accessor: "species",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div
      {...getTableProps()}
      style={{ display: "block", border: "1px solid black" }}
    >
      <div>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            style={{ display: "flex" }}
          >
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                style={{ flex: "1 0 0", border: "1px solid gray" }}
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        {...getTableBodyProps()}
        style={{ height: "400px", overflow: "auto" }}
      >
        <List
          height={400}
          itemCount={rows.length}
          itemSize={50}
          onItemsRendered={({ visibleStopIndex }) => {
            if (rows.length - visibleStopIndex < 5 && !loading) {
              setPage((old) => old + 1);
            }
          }}
        >
          {({ index, style }) => {
            const row = rows[index];
            prepareRow(row);
            return (
              <div
                {...row.getRowProps({ style: { ...style, display: "flex" } })}
              >
                {row.cells.map((cell) => (
                  <div
                    {...cell.getCellProps()}
                    style={{ flex: "1 0 0", border: "1px solid gray" }}
                  >
                    {cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
};

export default InfiniteScrollTable;
