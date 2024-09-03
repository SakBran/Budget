"use client"; // Client-side component

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

// Define a type for the transaction data
export type TransactionData = {
  amount: number;
  description: string;
  date: string;
  userId: string;
  categoryId: number;
  transactionTypeId: number;
  financialAccountId: number;
  isDeleted: boolean;
};

type TransactionType = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

type FinancialAccount = {
  id: number;
  name: string;
};

export interface User {
  id: string; // Unique identifier for the user
}

const Stepper: React.FC = () => {
  // State to manage the current step
  const [currentStep, setCurrentStep] = useState(1);
  const { status, data: session } = useSession();
  let user = session?.user!;

  // State to manage transaction data
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0,
    description: "",
    date: "",
    userId: "",
    categoryId: 0,
    transactionTypeId: 0,
    financialAccountId: 0,
    isDeleted: false,
  });
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [financialAccount, setFinancialAccount] = useState<FinancialAccount[]>(
    []
  );
  const [loginUser, setLoginUser] = useState<User>({ id: "" });
  const [loading, setLoading] = useState(true);

  // Fetch TransactionTypes on component mount
  const fetchData = async () => {
    setLoading(true); // Start loading

    try {
      const [
        transactionTypesResponse,
        categoriesResponse,
        financialAccountsResponse,
      ] = await Promise.all([
        fetch("/api/transationType"),
        fetch("/api/category"),
        fetch("/api/financialAccount"),
      ]);

      const [transactionTypesData, categoriesData, financialAccountsData] =
        await Promise.all([
          transactionTypesResponse.json(),
          categoriesResponse.json(),
          financialAccountsResponse.json(),
        ]);

      setTransactionTypes(transactionTypesData);
      setCategories(categoriesData);
      setFinancialAccount(financialAccountsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchUserData = async () => {
    const url = "/api/user?email=" + session?.user?.email!;
    const res = await fetch(url, { cache: "no-store" });
    const response = await res.json();

    //setLoginUser(user);
    if (response) {
      setTransactionData((prev) => ({
        ...prev,
        userId: response[0].id,
      }));
    }
    console.log(transactionData);
  };
  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  // Function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>
  ) => {
    const { name, value, type, checked } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to handle next button click
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  // Function to handle previous button click
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Logic to submit form data
    const createAPI = async () => {
      const url = "/api/transaction";
      const res = await fetch(url, {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify that the content is JSON
        },
        body: JSON.stringify(transactionData), // Convert body object to JSON string
      });
      const response = await res.json();
      console.log(response);
      handleOpenModal();
    };
    createAPI();
    console.log("Submitted Data:", transactionData);
  };

  const [isOpen, setIsOpen] = useState(false); // State to control the modal

  const handleOpenModal = () => {
    setIsOpen(true); // Function to open the modal
  };

  const handleCloseModal = () => {
    setTransactionData({
      amount: 0,
      description: "",
      date: "",
      userId: "",
      categoryId: 0,
      transactionTypeId: 0,
      financialAccountId: 0,
      isDeleted: false,
    });
    setCurrentStep(1);
    setIsOpen(false); // Function to close the modal
  };

  return (
    <div className="flex flex-col items-center p-5 w-full max-w-lg mx-auto">
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Successfully Created</h3>
            <p className="py-4">
              Your cash flow data is successfully recorded in database. Goodjob.
            </p>
            <div className="modal-action">
              {/* Button to close the modal */}
              <button className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stepper Indicators */}
      <ul className="steps steps-horizontal mb-5">
        <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
          Step 1
        </li>
        <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
          Step 2
        </li>
        <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
          Step 3
        </li>
        <li className={`step ${currentStep >= 4 ? "step-primary" : ""}`}>
          Step 4
        </li>
      </ul>

      {/* Step Content */}
      <div className="mb-5 w-full">
        {currentStep === 1 && (
          <div>
            <p>Step 1: Transaction Details</p>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={transactionData.amount}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={transactionData.description}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="date"
              name="date"
              value={transactionData.date}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p>Step 2: User and Category Information</p>
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              value={transactionData.userId}
              onChange={handleInputChange}
              className="hidden"
            />

            <select
              id="categoryId"
              name="categoryId"
              value={transactionData.categoryId}
              onChange={handleInputChange}
              className="select select-bordered w-full mb-2"
              disabled={loading}
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Select Category</option>
                  {categories.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </>
              )}
            </select>

            <select
              id="transactionTypeId"
              name="transactionTypeId"
              value={transactionData.transactionTypeId}
              onChange={handleInputChange}
              className="select select-bordered w-full mb-2"
              disabled={loading}
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Select Transaction Type</option>
                  {transactionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            {/* </div> */}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p>Step 3: Financial Account Information</p>

            <select
              id="financialAccountId"
              name="financialAccountId"
              value={transactionData.financialAccountId}
              onChange={handleInputChange}
              className="select select-bordered w-full mb-2"
              disabled={loading}
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Select Financial Account</option>
                  {financialAccount.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Is Deleted</span>
                <input
                  type="checkbox"
                  name="isDeleted"
                  checked={transactionData.isDeleted}
                  onChange={handleInputChange}
                  className="checkbox"
                />
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <p>Step 4: Review and Confirm</p>
            <pre className="bg-gray-100 p-4 rounded w-full">
              {JSON.stringify(transactionData, null, 2)}
            </pre>
            {/* <button className="btn btn-success mt-4" onClick={handleSubmit}>
              Submit
            </button> */}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div>
        <button
          className="btn btn-secondary mr-2"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        {currentStep < 4 ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;
