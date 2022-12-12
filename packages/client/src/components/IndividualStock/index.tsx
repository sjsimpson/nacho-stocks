import './style.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BuyWidget } from './BuyWidget';

import { LoadingSpinner, LoadingSpinnerVariants } from 'm3-react'
import { PriceGraph } from './PriceGraph';
import { Stock } from '../../types/stocks';

import { getStock, getStockPrice } from '../../api/stocksApi';

export const IndividualStock = () => {
  let [stock, setStock] = useState<Stock | undefined>(undefined);
  let [price, setPrice] = useState<number | undefined>(undefined);

  const { symbol } = useParams();

  useEffect(() => {
    getStock(symbol!)
      .then((res) => {
        console.log('STOCK RESPONSE', res);
        setStock(res);
      })
      .catch((err) => {
        console.log('Error in useEffect', err);
      });
  }, []);

  useEffect(() => {
    getStockPrice(symbol!).then((res) => {
      setPrice(res.price);
    });
  });

  return (
    <div className="individual-stock">
      <div className="stock-page-header-container">
        <div className="stock-name-header">
          {stock ? (
            <div>
              <div className="stock-name">{stock?.name}</div>
              <div className="stock-symbol">{stock?.symbol}</div>
            </div>
          ) : (
            <LoadingSpinner
              size={LoadingSpinnerVariants.LoadingSpinnerSizes.large}
            />
          )}
        </div>
        <div className="stock-price-header">
          <div className="currency-symbol">$</div>
          {price ? (
            <div className="stock-price">{price.toFixed(2)}</div>
          ) : (
            <LoadingSpinner
              size={LoadingSpinnerVariants.LoadingSpinnerSizes.small}
            />
          )}
        </div>
      </div>
      <div className="graph">
        <PriceGraph symbol={symbol!} />
      </div>
      <div>
        {price ? (
          <BuyWidget price={price} />
        ) : (
          <LoadingSpinner
            size={LoadingSpinnerVariants.LoadingSpinnerSizes.small}
          />
        )}
      </div>
    </div>
  )
};
