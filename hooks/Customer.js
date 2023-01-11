import React, {createContext, useState, useEffect} from "react";

const CustomerContext = createContext(null);

function CustomerProvider({children, hotData}) {

  const [data, setData] = useState(null);

  useEffect(() => {
    setData(hotData)
  }, [hotData])

  return <CustomerContext.Provider value={{ data, setData }}>{children}</CustomerContext.Provider>
}

function useCustomer() {
  const context = React.useContext(CustomerContext);
  return {
    set: args => context.setData(args),
    ...context.data
  }
}

export {CustomerProvider, useCustomer}