
console.log('hello!');

const items = [
    {name: 'a', value: 'a'},
    {name: 'b', value: 'b'},
    {name: 'c', value: 'c'}
];

items.map(item => console.log('item.value', item.value));
let b = items.filter(item => item.name === 'b');

console.log('b', b);
console.log({...items});
