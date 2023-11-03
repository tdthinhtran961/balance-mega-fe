import React, { useRef } from 'react';
import { timeBuild } from './variable';

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const componentMounted = useRef(false);
    if (!componentMounted.current) {
      fetch('/meta.json')
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          let currentVersionDate = localStorage.getItem(timeBuild);
          currentVersionDate = parseInt(currentVersionDate);
          if (!currentVersionDate || latestVersionDate > currentVersionDate) {
            localStorage.setItem(timeBuild, new Date().getTime());
            refreshCacheAndReload();
          }
        });
      componentMounted.current = true;
    }

    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      // delete browser cache and hard reload
      window.location.reload(true);
    };

    return (
      <React.Fragment>
        <Component {...props} />
      </React.Fragment>
    );
  }

  return ClearCacheComponent;
}

export default withClearCache;
