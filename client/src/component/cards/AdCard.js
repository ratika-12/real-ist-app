import React from 'react';
import { Link } from 'react-router-dom'; 
import AdFeatures from './AdFeatures';
import { formatNumber } from '../../helpers/Ad';
export default function AdCard({ ad }) {

  const badgeColor = ad.action === 'Sell' ? 'blue' : 'red';
  const badgeText = `${ad.type} for ${ad.action}`;
  console.log("djbfjajfa", ad);

  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/ad/${ad.slug}`}>
        <div className="card hoverable shadow">
          <img
            src={ad?.photos?.[0]?.Location}
            alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
            style={{ height: '250px', objectFit: 'cover' }}
          />

          <div className="card-body">
            <h3>${formatNumber (ad?.price)}</h3>
            <p className="card-text">{ad?.address}</p>
            <AdFeatures ad={ad} />
          </div>
        </div>
        {badgeText && (
          <div
            style={{
              backgroundColor: badgeColor,
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1,
            }}
          >
            {badgeText}
          </div>
        )}
      </Link>
    </div>

  );
}
