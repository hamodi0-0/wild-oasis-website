export default async function Cabins() {
  const res = await fetch("https://dummyjson.com/users");
  const data = await res.json();
  console.log(data);

  interface UserProps {
    id: number;
    firstName: string;
  }

  return (
    <div>
      {data.users.map((user: UserProps) => (
        <li key={user.id}>{user.firstName}</li>
      ))}
    </div>
  );
}
