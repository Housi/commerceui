import {createContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import React from "react";

const UIContext = createContext(null);

function UIProvider({children}) {

  const [isCartOpen, setCartOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [lastClickedCollectionViewType, setLastClickedCollectionViewType] = useState(null);

  const router = useRouter();

  useEffect(() => {

    const handleRouteChange = () => {
      setCartOpen(false);
      setNavOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    }
  });

  return <UIContext.Provider
    value={{ isCartOpen, setCartOpen, isNavOpen, setNavOpen, lastClickedCollectionViewType, setLastClickedCollectionViewType }}
  >{children}</UIContext.Provider>
}

function useUI() {
  const context = React.useContext(UIContext);
  return {
    isCartOpen: context.isCartOpen,
    isNavOpen: context.isNavOpen,
    lastClickedCollectionViewType: context.lastClickedCollectionViewType,
    setLastClickedCollectionViewType: (viewType) => {
      context.setLastClickedCollectionViewType(viewType)
    },
    openCart: () => {
      context.setCartOpen(true);
    },
    closeCart: () => {
      context.setCartOpen(false);
    },
    openNav: () => {
      context.setNavOpen(true);
    },
    closeNav: () => {
      context.setNavOpen(false);
    },
  }
}

export {UIProvider, useUI}