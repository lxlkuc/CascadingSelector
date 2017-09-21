# CascadingSelector

## Installation

```bash
bower install CascadingSelector
```

## 使用

```js
$('.area_selector').CascadingSelector({
    id: 'areaSelector', // Selector的id，可为空
    theme: 'adminlte', // 显示外观，可为空，默认为adminlte（目前只有这一个）
    selected: {{ (int)$school->area_id }}, // 已选定值
    url: '{{ route("admin.areas.tree") }}?withparent=1', // json数据来源
    target: 'area_id', // input name
    submit: true, // 是否显示提交按钮，如无只能选择最小子节点，如有可选择中间节点
});
```

## Json数据格式

类似jstree的数据格式，多了一个group。
chilren：root层为子层节点集合，其他层为true，最终层为false。
group：分组，显示在各自的ul里。
['text' => '全国', 'children' => [], 'id' => '0', 'group' => 0]


