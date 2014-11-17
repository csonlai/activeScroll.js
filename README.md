ActiveScroll.js
===============

ActiveScroll.js is a zepto plugin to deal with the long data list.
It will remove dom out of the view when scroll out and resume them when scroll back into the view.

# How it works

ActiveScroll.js will do the follow works:

1.Create a wrap div for every page of items

2.Record the position of every page

3.When users scroll out of the view,remove pages which we could not see and use the placeholder instead.

4.When users scroll in the view,add items back into the view.


# Simple Example

Init the ActiveScroll.js plugin:

``` js
    var as = $('.list').activeScroll();
```

When we add items of page,we use addItems function instead of adding them to dom tree directly.

``` js
    as.addItems(newItems);
```


![image](http://www.alloyteam.com/wp-content/uploads/2014/11/C307E4AD-909C-43F3-9C84-24D61ADEC08C.jpg =150x)
