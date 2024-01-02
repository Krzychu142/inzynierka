import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useAppSelector } from "../../hooks";
useAppSelector;
import { IDecodedToken } from "../../types/decodedToken.interace";
import { Avatar, Button, List, Result } from "antd";
import { DownOutlined, UpOutlined, UserOutlined } from "@ant-design/icons";
import { useGetAllOperationsQuery } from "../../features/operationsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import dayjs from "dayjs";
import { ILastOperation, Operation } from "../../types/operation.interface";
import Chart from "../../components/chart/Chart";

const Dashboard: React.FC = () => {
  const [displayedOperations, setDisplayedOperations] = useState(3);

  const decodedToken: IDecodedToken | null = useAppSelector(
    (state) => state.auth.decodedToken
  );

  const count = 3;

  const {
    data: operations,
    isLoading,
    isError,
    refetch,
  } = useGetAllOperationsQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  let userName: string | null = null;
  let userRole: string | null = null;
  let userEmail: string | null = null;
  let formattedEmail: string | null = null;

  if (decodedToken) {
    userName = decodedToken.name;
    userRole = decodedToken.role.toUpperCase();
    userEmail = decodedToken.email;
    formattedEmail = userEmail
      ? userEmail.replace(/([@.])/g, "$1\u200B")
      : null;
  }

  let loadMoreButtons = [];

  if (operations && operations.length > displayedOperations) {
    loadMoreButtons.push(
      <Button
        key="more"
        type="primary"
        onClick={() => setDisplayedOperations(displayedOperations + count)}
      >
        load more
        <DownOutlined />
      </Button>
    );
  }
  if (displayedOperations > count) {
    loadMoreButtons.push(
      <Button
        key="less"
        type="primary"
        onClick={() => setDisplayedOperations((prev) => prev - count)}
        className="load-more__button--rigth"
      >
        show less
        <UpOutlined />
      </Button>
    );
  }

  const loadMore = <div className="load-more">{loadMoreButtons}</div>;

  const sortOperationsByDate = (ops: ILastOperation[]) => {
    return ops.slice().sort((a, b) => {
      const dateA = new Date(a.dateExecution);
      const dateB = new Date(b.dateExecution);
      return dateB.getTime() - dateA.getTime();
    });
  };

  return (
    <>
      <main className="dashboard">
        <section className="dashboard__user">
          <Avatar icon={<UserOutlined />} size={128} />
          <h2>
            Hello <span className="darker bold">{userName}</span>
          </h2>
          <h2>
            Your role: <span className="secondary">{userRole}</span>
          </h2>
          <h2>
            Your email: <span className="secondary">{formattedEmail}</span>
          </h2>
        </section>
        <section className="dashboard__last__activity">
          {isLoading && <LoadingSpinner />}
          {isError && (
            <Result
              status="error"
              title="Somthing goes wrong"
              subTitle="Please try later"
            ></Result>
          )}
          {<Chart />}
          {operations && (
            <>
              <h2>Last operations</h2>
              <List
                className="operation-list"
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={sortOperationsByDate(operations).slice(
                  0,
                  displayedOperations
                )}
                renderItem={(operation: ILastOperation) => (
                  <List.Item
                    key={operation._id}
                    className="operation-list__single-item"
                  >
                    <List.Item.Meta
                      title={
                        <span className="">{operation.nameOfOperation}</span>
                      }
                      description={
                        <>
                          <span className="date-display normal-text">
                            {`${dayjs(operation.dateExecution).format(
                              "DD-MM-YYYY HH:mm:ss"
                            )}`}
                          </span>
                          {operation.nameOfOperation ===
                            Operation.NEWCLIENT && (
                            <span className="operation-performed normal-text">
                              New client email:
                            </span>
                          )}
                          {operation.nameOfOperation === Operation.NEWORDER && (
                            <span className="operation-performed normal-text">
                              Client email:
                            </span>
                          )}
                          <span className="operation-performed">
                            <a
                              className="darker bold"
                              href={`mailto:${operation.operationPerformedBy}`}
                            >
                              {operation.operationPerformedBy}
                            </a>
                          </span>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;
