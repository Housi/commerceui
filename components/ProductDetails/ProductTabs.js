import React from 'react'

import Tabs from "../Tabs";
import Accordion from "../Accordion";
import RichText from "../RichText"

const ProductTabs = ({product, isBundle, globalSettings}) => {

  let _tabs = [];

  if(product.descriptionHtml) {
    _tabs.push({
      title: "Description",
      content: isBundle ? <div>{product.bundlePieces.map((piece, i) => <Accordion title={piece.title} isOpenAtStart={i === 0}  hasTopBorder={i === 0} key={i}><div dangerouslySetInnerHTML={{__html: piece.descriptionHtml}}/></Accordion>)}</div> : product.descriptionHtml,
    })
  }
  if(isBundle) {
    if(product.bundlePieces.some(p => p.detailsHtml && p.detailsHtml !== "")) {
      _tabs.push({
        title: "Details",
        content: <div>
          {product.bundlePieces.map((piece, i) => {
            return <Accordion title={piece.title} hasTopBorder={i === 0}  key={i}><RichText plainHtml={piece.detailsHtml} isSmall /></Accordion>
          })}
        </div>
      })
    }
  } else {
    if(product.detailsHtml && product.detailsHtml !== "") {
      _tabs.push({
        title: "Details",
        content: <RichText plainHtml={product.detailsHtml} isSmall />
      })
    }
  }

  const getFabricContentFromTags = (tags) => {
    const _fabricTag = tags?.find(t => t.startsWith("fabric-"))
    if ( !_fabricTag ) {
      return null
    }
    return _fabricTag && globalSettings.productFabrics.find(f => f.fabricTag === _fabricTag)
  };

  if (isBundle) {
    let fabrics = [];
    product.bundlePieces.forEach((piece) => {
      const fabric = getFabricContentFromTags(piece.tags)
      if(fabric) {
        fabrics.push({
          productTitle: piece.title,
          productFabricContent: fabric
        })
      }
    })

    if(fabrics.length > 0) {
      _tabs.push({
        title: "Fabric technology",
        content: <div>{fabrics.map((f, i) => <Accordion title={f.productTitle} hasTopBorder={i === 0} key={i}><RichText json={f.productFabricContent.content.json} isSmall /></Accordion>)}</div>,
      })
    }
  } else {
    const fabric = getFabricContentFromTags(product.tags)
    if( fabric ) {
      _tabs.push({
        title: "Fabric technology",
        content: <RichText json={fabric.content.json} isSmall />,
      })
    }
  }
  if(globalSettings.productSettings.shippingTabContent) {
    _tabs.push({
      title: "Shipping",
      content: <RichText json={globalSettings.productSettings.shippingTabContent.json} isSmall />
    })
  }

  return _tabs.length > 0 && <Tabs
    tabs={_tabs}
    ariaLabel={"Product details tabs"}
    id={"product_details_tabs"}
  />
}

export default ProductTabs