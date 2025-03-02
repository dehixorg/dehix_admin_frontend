export const AdminDetails = ({ data }: { data: Record<string, any> }) => {
  return (
    <>
      <div>
        <p>
          <strong>First Name:</strong> {data.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {data.lastName}
        </p>
        <p>
          <strong>Username:</strong> {data.userName}
        </p>
        <p>
          <strong>Email ID:</strong> {data.email}
        </p>
        <p>
          <strong>Phone No.:</strong> {data.phone}
        </p>
        <p>
          <strong>Type:</strong> {data.type}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
      </div>
    </>
  );
};
