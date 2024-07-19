"use client";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NAdmin } from "./newAdmin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EditAdmin } from "./editAdmins";
import { DelAdmin } from "./delAdmin";

export default function Admins() {
  const [addAdmin, setAddAdmin] = useState(false);

  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  const [editAdmin, setEditAdmin] = useState(false);

  const [adminData, setAdminData] = useState();

  const [delAdmin, setDelAdmin] = useState(false);

  const [searchKeyword,setSearchKeyword] = useState("")

  useEffect(() => {
    const getAdmins = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admins?search=${searchKeyword}`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        // toast.success(responseData.message)

        // console.log(responseData.employees)

        setAdmins(responseData.admins);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again!");
      }
    };

    if (gData || searchKeyword || !searchKeyword) {
      getAdmins();
      setGData(false);
    }
  }, [gData,searchKeyword]);

  return (
    <div>
      {addAdmin && <NAdmin setAddAdmin={setAddAdmin} setGData={setGData} />}
      {editAdmin && (
        <EditAdmin
          setEditAdmin={setEditAdmin}
          setGData={setGData}
          adminData={adminData}
        />
      )}
      {delAdmin && (
        <DelAdmin
          setDelAdmin={setDelAdmin}
          setGData={setGData}
          adminId={adminData.id}
        />
      )}

      <h1>Admins</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div class="p-4 bg-gray-800 flex justify-between">
          <div>
            <label for="table-search" class="sr-only">
              Search
            </label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                class="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search admins"
                onInput={(e)=>setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setAddAdmin(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Admin
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={3} class="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {admin.name}
                  </th>
                  <td class="px-6 py-4">{admin.email}</td>
                  <td class="px-6 py-4">
                    <span
                      onClick={() => {
                        setAdminData(admin);
                        setEditAdmin(true);
                      }}
                      class="font-medium text-blue-600 hover:underline mr-2 cursor-pointer"
                    >
                      Edit
                    </span>
                    <span
                     onClick={() => {
                      setAdminData(admin);
                      setDelAdmin(true);
                    }}
                      class="font-medium hover:underline text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={3} class="px-6 py-4 text-center">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
