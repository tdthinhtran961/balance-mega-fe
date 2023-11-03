import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'components';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineMarkers,
  CustomMarker,
} from 'react-calendar-timeline';
import moment from 'moment';

const Component = ({
  Get,
  onClick,
  isLoading = false,
  isGroup = false,
  title = 'Task list',
  defaultTimeStart = moment().add(-2, 'days'),
  defaultTimeEnd = moment().add(2, 'days'),
  primaryColor = '#3b5998',
  selectedColor = '#0088FE',
  textColor = '#FFFFFF',
}) => {
  const keys = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'title',
    itemDivTitleKey: 'title',
    itemGroupKey: 'group',
    itemTimeStartKey: 'start',
    itemTimeEndKey: 'end',
    groupLabelKey: 'title',
  };
  const [groups, set_groups] = useState([
    {
      id: 1,
      title: 'group 1',
      root: true,
      parent: null,
      hasChildren: true,
      levelChildren: 0,
    },
  ]);
  const [items, set_items] = useState([
    {
      id: 1,
      group: 1,
      title: 'item 1',
      start: moment(),
      end: moment().add(1, 'hour'),
    },
  ]);
  const [openGroups, set_openGroups] = useState({});
  const initFunction = useCallback(async () => {
    if (Get) {
      const { groups, items } = await Get();
      set_groups(groups);
      set_items(items);
    } else {
      const generateData = (groupCount = 3, itemCount = 3, daysInPast = 3) => {
        const groups = [];
        for (let i = 0; i < groupCount; i++) {
          groups.push({
            id: `${i + 1}`,
            title: 'Nguyên Văn ' + i,
          });
        }

        let items = [];
        for (let i = 0; i < itemCount; i++) {
          const startDate = moment().subtract(Math.floor(Math.random() * daysInPast), 'days');
          const endValue = moment().add(Math.floor(Math.random() * daysInPast), 'days');

          items.push({
            id: i + '',
            group: (i % groups.length) + 1,
            title: 'Title sample',
            start: startDate,
            end: endValue,
          });
        }

        items = items.sort((a, b) => b - a);

        return { groups, items };
      };
      const { groups, items } = generateData();
      const newGroups = groups.map((group) => {
        const isRoot = (parseInt(group.id) - 1) % 3 === 0;
        const parent = isRoot ? null : Math.floor((parseInt(group.id) - 1) / 3) * 3 + 1;
        return Object.assign({}, group, {
          root: isRoot,
          parent,
          hasChildren: isRoot,
          levelChildren: isRoot ? 0 : 1,
        });
      });
      set_groups(newGroups);
      set_items(items);
    }
  }, [Get]);
  useEffect(() => {
    initFunction();
  }, [initFunction]);

  const toggleGroup = (id) => {
    if (!openGroups[id]) {
      openGroups[id] = true;
    } else {
      for (const key in openGroups) {
        if (Object.prototype.hasOwnProperty.call(openGroups, key) && key.indexOf(id) > -1) {
          openGroups[key] = false;
        }
      }
    }
    set_openGroups({ ...openGroups });
  };

  const newGroups = groups
    .filter((g) => (isGroup && (g.root || openGroups[g.parent])) || !isGroup)
    .map((group) => {
      return Object.assign({}, group, {
        title:
          !!isGroup && group.hasChildren ? (
            <div
              onClick={() => toggleGroup(group.id)}
              style={{
                cursor: 'pointer',
                paddingLeft: group.levelChildren * 15,
              }}
            >
              {openGroups[group.id] ? <i className="las la-angle-down" /> : <i className="las la-angle-right" />}{' '}
              {group.title}
            </div>
          ) : (
            <div style={{ paddingLeft: isGroup ? group.levelChildren * 15 : 0 }}>{group.title}</div>
          ),
      });
    });

  const itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected
      ? itemContext.dragging
        ? 'red'
        : selectedColor
      : item.bgColor || primaryColor;
    const color = itemContext.resizing ? 'red' : item.color || textColor;
    // noinspection JSUnusedGlobalSymbols
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color,
            borderRadius: 4,
          },
          onMouseDown: () => onClick && onClick(item),
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: 'hidden',
            paddingLeft: 3,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  return (
    <Spin spinning={isLoading}>
      <Timeline
        groups={newGroups}
        items={items}
        keys={keys}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        canMove={false}
        onItemClick={(itemId) => onClick && onClick({ id: itemId })}
        timeSteps={{ second: 0, minute: 0, hour: 0, day: 1, month: 1, year: 1 }}
        itemRenderer={itemRenderer}
      >
        <TimelineHeaders className="sticky">
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className="title-left">
                  {title}
                </div>
              );
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
        <TimelineMarkers>
          <CustomMarker date={+moment().endOf('days')}>
            {({ styles }) => {
              const customStyles = {
                ...styles,
                backgroundColor: '#9AC43D',
                width: '6px',
              };
              return <div style={customStyles} />;
            }}
          </CustomMarker>
        </TimelineMarkers>
      </Timeline>
    </Spin>
  );
};
export default Component;
