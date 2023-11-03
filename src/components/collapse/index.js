import React, { createRef, useEffect, useRef, useState } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import { v4 } from 'uuid';
import { useLocation } from 'react-router-dom';

const Component = ({
  title,
  className = '',
  classNameParent = '',
  children,
  showArrow = true,
  popover = false,
  isExpand = false,
}) => {
  const ref = createRef();
  const arrow = createRef();
  const [visible, set_visible] = useState(false);
  const [id] = useState('collapse_' + v4());
  const [visiblePopover, set_visiblePopover] = useState(false);
  const visibleChild = useRef(false);
  const location = useLocation();

  useEffect(() => {
    set_visiblePopover(false);
  }, [location]);

  useEffect(() => {
    if (visible !== popover) {
      if (popover) {
        ref.current.style.removeProperty('height');
      }
      setTimeout(() => {
        set_visible(popover);
      }, 150);
    }
    if (!popover && isExpand) {
      setTimeout(() => {
        document.getElementById(id).click();
      }, 150);
    }
  }, [popover]);

  const onClick = () => {
    if (!popover) {
      if (ref.current.style.height === 'auto') {
        ref.current.style.height = ref.current.offsetHeight + 'px';
      }
      setTimeout(() => {
        arrow.current?.classList[!ref.current.style.height ? 'add' : 'remove']('rotate-90');
        ref.current.style.height = !ref.current.style.height ? ref.current.scrollHeight + 'px' : '';
        if (ref.current.style.height) {
          setTimeout(() => {
            ref.current.style.height = 'auto';
          }, 150);
        }
      });
    }
  };

  const titleBlock = (
    <div className={className} onClick={onClick} id={id}>
      {title}
      {showArrow && (
        <i className="las la-angle-right absolute right-3 transition-all duration-300 ease-in-out" ref={arrow} />
      )}
    </div>
  );

  return (
    <li className={classNameParent}>
      {!visible ? (
        titleBlock
      ) : (
        <Popover
          content={
            <div
              onMouseEnter={() => {
                visibleChild.current = true;
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 1024) {
                  visibleChild.current = false;
                  setTimeout(() => {
                    if (visibleChild.current === false) {
                      set_visiblePopover(false);
                    }
                  }, 200);
                }
              }}
            >
              {children}
            </div>
          }
          placement="rightTop"
          visible={visiblePopover}
          onMouseEnter={() => set_visiblePopover(true)}
          onMouseLeave={() => {
            if (window.innerWidth > 640) {
              visibleChild.current = false;
              setTimeout(() => {
                if (visibleChild.current === false) {
                  set_visiblePopover(false);
                }
              }, 500);
            }
          }}
        >
          {titleBlock}
        </Popover>
      )}
      <ul
        className={classNames('transition-all duration-300 ease-in-out overflow-hidden h-0 collapse', {
          'scale-0 h-0': visible,
          'scale-1': !visible,
        })}
        ref={ref}
      >
        {children}
      </ul>
    </li>
  );
};

export default Component;
