"use client";
import { faArrowDownLong, faArrowUpLong, faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewMemo } from "./nMemo";
import { useEffect, useState } from "react";
import { MemoDetails } from "./details";

export default function Memo() {
  const [nMemo, setNMemo] = useState(false);

  const [memos, setMemos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  const [viewMemo,setViewMemo] = useState(false)

  const [memoData,setMemoData] = useState()

  useEffect(() => {
    const getMemos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/memo");
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        // toast.success(responseData.message)

        // console.log(responseData.employees)

        setMemos(responseData.memos);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again!");
      }
    };

    if (gData) {
      getMemos();
      setGData(false);
    }
  }, [gData]);

  return (
    <div>
      {nMemo && <NewMemo setNMemo={setNMemo} setGData={setGData} />}
      {viewMemo && <MemoDetails setViewMemo={setViewMemo} memoData={memoData} setGData={setGData} />}
      <h1 className="text-xl font-medium">Memo</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div className="p-4 bg-gray-800 flex justify-between items-center gap-4">
          <div>
            <label htmlFor="date-input" className="sr-only">
              Select Date
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="date"
                id="date-input"
                className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select Date"
                // value={filterDate}
                // onChange={(e) => {
                //   setFilterDate(e.target.value);
                //   setGData(true);
                // }}
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setNMemo(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              Memo
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>

              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} className="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : memos.length > 0 ? (
              memos.map((memo) => (
                <tr className="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <span
                      className={`text-xs font-medium text-gray-100 p-2 rounded ${
                        memo.customTag == "Sent"
                          ? "text-blue-700"
                          : "text-green-700"
                      }`}
                    >
                      {memo.customTag} <FontAwesomeIcon icon={memo.customTag == "Sent"
                          ? faArrowUpLong
                          : faArrowDownLong} />
                    </span>
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {new Date(memo.createdAt).toDateString()}
                  </th>
                  <td className="px-6 py-4">{memo.title}</td>
                  <td className="px-6 py-4 text-xs">
                    <span
                      className={`text-xs font-medium text-gray-100 p-2 rounded ${
                        memo.status == "PENDING"
                          ? "bg-yellow-700"
                          : memo.status == "APPROVED"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {memo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                        onClick={() => {
                          setViewMemo(true);
                          setMemoData(memo);
                        }}
                      className="font-medium text-blue-600 hover:underline mr-2 cursor-pointer"
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} className="px-6 py-4 text-center">
                  No memo found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
