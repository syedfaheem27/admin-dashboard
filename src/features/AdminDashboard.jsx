import styled from "styled-components";
import AdminTable from "./AdminTable";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import Spinner from "../ui/Spinner";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { API } from "../utils/constants";
import UsersNotFound from "../ui/UsersNotFound";

const StyledDashboard = styled.div`
  max-width: 95%;
  margin: 0.2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem;
`;

const StyledTableContainer = styled.div`
  width: 100%;
`;

export default function AdminDashboard() {
  const { users, setUsers, cachedUsers, setCachedUsers, setIsChecked, pageNum, setPageNum } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);



  function searchUsers(searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase()
    const filteredUsers = cachedUsers.filter(
      (user) =>
        user.name.toLowerCase().startsWith(normalizedQuery) ||
        user.email.toLowerCase().startsWith(normalizedQuery) ||
        user.role.toLowerCase().startsWith(normalizedQuery)
    )

    setPageNum(1);
    setUsers(filteredUsers);


    setIsChecked(false)
  }

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(API);

      const data = await response.json();
      const users = addCheckedFlag(data);
      setUsers(users);
      setCachedUsers(users)
    }

    function addCheckedFlag(data) {
      return data.map((el) => {
        return { checked: false, ...el };
      });
    }

    try {
      setIsLoading(true);
      getUsers();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [setUsers, setCachedUsers]);


  return (
    <StyledDashboard>
      <SearchBar searchUsers={searchUsers} />
      {isLoading ? (
        <Spinner />
      ) : users.length === 0 ? <UsersNotFound /> : (
        <>
          <StyledTableContainer>
            <AdminTable />
          </StyledTableContainer>
          <Footer />
        </>
      )}
    </StyledDashboard>
  );
}
