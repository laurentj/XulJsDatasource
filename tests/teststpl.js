

var datatest1 = [
    {id:1, title:'aaaa'},
    {id:2, title:'bbb'},
    {id:3, title:'ccc'},
    {id:4, title:'ddd'},
    {id:5, title:'eee'}
]

var datatest2 = [
    {id:1, title:'aaaa'},
    {id:3, title:'ccc', subcat:[
        {id:6, title:'ccc1'},
        {id:8, title:'ccc3'},
        {id:7, title:'ccc2', subcat:[
            {id:10, title:'ccc22'},
            {id:9, title:'ccc21'},
            ]},
        ]},
    {id:5, title:'eee'},
    {id:4, title:'ddd', subcat:[
        {id:12, title:'ddd2'},
        {id:11, title:'ddd1'},
        ]},
    {id:2, title:'bbb', subcat:[]},
]
