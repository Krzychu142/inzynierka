import { useEffect } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Avatar, List, Result, Skeleton, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const EmployeesListing = () => {
  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useGetAllEmployeesQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      {isError && (
        <Result
          status="error"
          title="Somthing goes wrong"
          subTitle="Please try later"
        ></Result>
      )}
      {isLoading && (
        <Spin tip="Loading" size="large">
          <div />
        </Spin>
      )}
      {employees && (
        <List
          itemLayout="horizontal"
          loading={isLoading}
          dataSource={employees}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit">edit</a>,
                <a key="list-loadmore-more">more</a>,
              ]}
            >
              {isLoading ? (
                <Skeleton avatar title={false} active />
              ) : (
                <>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<a href="https://ant.design"></a>} // załóżmy, że item ma pole 'name'
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                  <div>content</div>
                </>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EmployeesListing;
