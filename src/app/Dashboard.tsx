// pages/index.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Country } from "../types";
import _ from "lodash";
import Image from "next/image";

interface HomeProps {
  countries: Country[];
}

const Dashboard: React.FC<HomeProps> = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryDetails, setCountryDetails] = useState<Country[]>([]);
  const [filterOptions, setFilterOptions] = useState<Country[]>([]);
  const [serachValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSearch = useCallback(
    _.debounce((serachValue) => {
      axios
        .get(`https://restcountries.com/v3.1/name/${serachValue}`)
        .then((res) => {
          setCountries(res?.data);
        })
        .catch((error) => console.log(error));
    }, 500),
    []
  );

  const handleSearchChange = (e: any) => {
    e.preventDefault(e);
    let searchText = e.target.value;
    searchText ? handleSearch(searchText) : fetchApi();
    setSearchValue(searchText);
  };

  const handleModalOpen = (country: string) => {
    axios
      .get(`https://restcountries.com/v3.1/name/${country}`)
      .then((res) => {
        setCountryDetails(res?.data);
      })
      .catch((error) => console.log(error));

    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCountryDetails([]);
  };

  const handleSortCountries = () => {
    const sortedCountries = countries.sort(
      (a, b) => a.population - b.population
    );
    setCountryDetails(sortedCountries);
  };

  const handleFilterCountries = (e: any) => {
    const filterValue = e.target.value;
    setFilterValue(filterValue);

    if (filterValue && filterValue.length) {
      const filteredCountries = countries.filter(
        (country) => country.region === filterValue
      );
      setCountries(filteredCountries);
    }
  };

  const fetchApi = () => {
    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then((res) => {
        setCountries(res?.data);
        setFilterOptions(res?.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <main>
      <div className="text-center">
        <h1 className="text-lg my-3">Countries of the World</h1>

        <div className="">
          <input
            className="border-b-2 rounded-md shadow-sm border  outline-none p-2 min-w-96   "
            type="text"
            value={serachValue}
            onChange={handleSearchChange}
            placeholder="Search Country"
          />
          <button
            onClick={() => {
              setSearchValue("");
              setFilterValue("");
              fetchApi();
            }}
            className="border p-2 mx-4 shadow-md rounded-md "
          >
            Clear All
          </button>

          <button
            onClick={handleSortCountries}
            className="border p-2 mx-4 shadow-md rounded-md "
          >
            Sort Countries By Population
          </button>

          <select
            value={filterValue}
            onChange={handleFilterCountries}
            className="border p-2 rounded-md shadow-md  "
          >
            <option value="">All</option>
            {filterOptions &&
              filterOptions?.map((item, index) => (
                <option value={item.region} key={index}>
                  {item.region}
                </option>
              ))}
          </select>
        </div>
      </div>

      <ul className=" mt-5 flex justify-around flex-wrap ">
        {countries.length && countries ? (
          countries.map((country, index) => (
            <li
              key={country?.name?.official}
              className="w-2/12 m-3 border rounded-md cursor-pointer "
              onClick={() => handleModalOpen(country?.name?.official)}
            >
              <div className="h-1/2 ">
                <Image
                  className="h-full rounded-md"
                  src={country?.flags?.png}
                  height={500}
                  width={300}
                  alt={country?.name?.common}
                  blurDataURL="/blurImg.jpg"
                />
              </div>

              <div className="h-1/2 bg-slate-100 p-2 flex flex-col justify-between ">
                <h2 key={index}>
                  Name: <span className="">{country?.name?.common} </span>
                </h2>
                {country?.capital?.map((item, i) => (
                  <p key={i}>Capital: {item}</p>
                ))}
                <p>Region: {country?.region}</p>
                <p>Subregion: {country?.subregion}</p>
                <p>Population: {country?.population?.toLocaleString()}</p>
              </div>
            </li>
          ))
        ) : (
          <Image
            src={"/spinner.svg"}
            height={500}
            width={500}
            alt="Loading..."
          />
        )}
      </ul>

      {showModal === true ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-3xl mx-auto ">
            {countryDetails ? (
              <div className="flex justify-between  ">
                <div className=" me-2 ">
                  {countryDetails[0]?.flags?.png ? (
                    <Image
                      className="h-full rounded-md"
                      src={countryDetails[0]?.flags?.png}
                      height={300}
                      width={300}
                      alt={countryDetails[0]?.name?.common}
                      placeholder="blur"
                      blurDataURL="/blurImg.jpg"
                    />
                  ) : (
                    <Image
                      className="h-full rounded-md"
                      src={"/blurImg.jpg"}
                      height={300}
                      width={300}
                      alt={countryDetails[0]?.name?.common}
                      placeholder="blur"
                      blurDataURL="/blurImg.jpg"
                    />
                  )}
                </div>

                <div className=" bg-slate-100 p-2 flex flex-col justify-between ">
                  <h2>
                    Name:{" "}
                    <span className="">{countryDetails[0]?.name.common} </span>
                  </h2>
                  {countryDetails[0]?.capital?.map((item, i) => (
                    <p key={i}>Capital: {item}</p>
                  ))}
                  <p>Region: {countryDetails[0]?.region}</p>
                  <p>Subregion: {countryDetails[0]?.subregion}</p>
                  <p>
                    Population: {countryDetails[0]?.population.toLocaleString()}
                  </p>

                  <p>
                    Currency:{" "}
                    {countryDetails[0]?.currencies &&
                      Object.keys(countryDetails[0]?.currencies).map((key) => {
                        const currencyDetails =
                          countryDetails[0]?.currencies[
                            key as keyof (typeof countryDetails)[0]["currencies"]
                          ];
                        return (
                          <span key={key}>
                            {currencyDetails?.name} ({currencyDetails?.symbol}){" "}
                          </span>
                        );
                      })}
                  </p>

                  <p>
                    Languages:{" "}
                    {countryDetails[0]?.languages &&
                      Object.keys(countryDetails[0]?.languages).map((key) => (
                        <span key={key}>
                          {countryDetails[0]?.languages[key]}{" "}
                        </span>
                      ))}
                  </p>

                  <p>region: {countryDetails[0]?.region}</p>

                  <p>
                    Time Zones: {countryDetails[0]?.timezones.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center align-middle py-10 w-96 h-96 ">
                <Image
                  src={"/spinner.svg"}
                  height={500}
                  width={500}
                  alt="Loading..."
                />
              </div>
            )}

            <div className="text-right mt-2 ">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default Dashboard;
function setFilterOoptions(region: any) {
  throw new Error("Function not implemented.");
}
