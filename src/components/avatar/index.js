import React from 'react';
import { Popover } from 'antd';

import { getColorByLetter, getFirstLetter, pickTextColorBasedOnBgColorAdvanced } from 'utils';
import classNames from 'classnames';

const Component = ({
  text,
  src,
  onClick,
  size = 7,
  showName = true,
  isGroup = false,
  keySrc = 'avatarPath',
  keyName = 'fullName',
  maxCount = 4,
}) => {
  const Avatar = ({ onClick, text, src, showName, size, index = 0 }) => (
    <div onClick={onClick} className={classNames({ 'flex items-center': showName })}>
      {!text || (src && src.indexOf('/defaultAvatar.png') === -1) ? (
        <div className={classNames({ '-ml-2': index > 0 })}>
          <img
            className={classNames('rounded-xl object-cover object-center', 'h-' + size, 'w-' + size)}
            src={src}
            alt="Avatar"
          />
        </div>
      ) : (
        <div
          className={classNames('rounded-xl inline-block text-center', 'w-' + size, 'h-' + size, 'leading-' + size, {
            '-ml-2': index > 0,
          })}
          style={{
            color: pickTextColorBasedOnBgColorAdvanced(getColorByLetter(text)),
            backgroundColor: getColorByLetter(text),
          }}
        >
          <strong>{getFirstLetter(text)}</strong>
        </div>
      )}
      {!!showName && !!text && <span className={classNames('ml-1', { 'link-click': !!onClick })}>{text}</span>}
    </div>
  );

  if (!isGroup) {
    return <Avatar onClick={onClick} text={text} src={src} showName={showName} size={size} />;
  } else {
    return (
      <div onClick={onClick} className="flex items-center">
        {!!text &&
          text
            .filter((item, index) => index < maxCount)
            .map((item, index) => {
              return (
                <Avatar
                  onClick={null}
                  text={item[keyName]}
                  src={item[keySrc]}
                  showName={false}
                  size={size}
                  index={index}
                  key={index}
                />
              );
            })}
        {!!text && text.length > maxCount && (
          <Popover
            content={text
              .filter((item, index) => index >= maxCount)
              .map((item, index) => (
                <Avatar
                  onClick={null}
                  showName={true}
                  text={item[keyName]}
                  src={item[keySrc]}
                  size={size}
                  key={index}
                />
              ))}
          >
            <div
              className={classNames(
                'rounded-xl inline-block text-center border border-blue-500 text-blue-500 bg-blue-200 text-xs -ml-2',
                'w-' + size,
                'h-' + size,
                'leading-' + size,
              )}
            >
              +{text.length - maxCount}
            </div>
          </Popover>
        )}
      </div>
    );
  }
};
export default Component;
