<template>
    <div class="greetings">
      <h1 class="green">Shopping Mall</h1>
      <h2 class="cart"  v-if="cart.length>0" @click="showcart=true">Items Added to cart({{ cart.length }})</h2>
      <div class="searchcontainer">
            <div class="search">
                <input type="text" placeholder="Search Products" @input="seachProdcut" v-model="searchItem"/>
                <button @click="seachProdcut">Search</button>
            </div>
            <div class="search">
                <button @click="sortProduct('price')">Sort by Price</button>
                <button @click="sortProduct('title')">Sort by Name</button>
                <button class="redbtn" @click="showFilterOption">Filter</button>
            </div>
        </div>
      <div>
        <div v-if="showFilter" class="filterbox">
            <span aria-hidden="true" class="closebtn" @click="showFilterOption"><i class="fa fa-window-close">X</i></span>
            <h2>Products</h2>
            <div class="filtergroup"> 
                <h3 @click="updateFilterList('category')">category  <i class="arrow fright" :class="showList=='category'?'down':'up'"></i></h3>
                <div v-if="showList=='category'">
                    <ul class="clist">
                        <li v-for="category in categories" :key="category" class="catItem">
                            <input type="checkbox" :value="category" :id="category" @click="updateSelectedCat($event)"  :checked="selectedCategories.indexOf(category)!=-1" />
                            <label :for="category">{{ category }}</label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="filtergroup">
                <h3 @click="updateFilterList('brand')">brands <i class="arrow fright" :class="showList=='brand'?'down':'up'"></i></h3>
                <div v-if="showList=='brand'">
                    <ul class="clist">
                        <li v-for="category in brands" :key="category" class="catItem">
                            <input type="checkbox" :value="category" :id="category" @click="updateSelectedBrand($event)"  :checked="selectedBrands.indexOf(category)!=-1"/>
                            <label :for="category">{{ category }}</label>
                        </li>
                    </ul>
                </div>  
            </div>
            <div>
                <button @click="applyFilter">Apply Filter</button>
                <button class="fright" @click="clearFilter">Clear Filter</button>
            </div>
        </div>
        <div>
            <ul class="plist">
                <li v-for="product in seachProdcut" :key="product.id" class="product">
                <img :src="product.thumbnail" alt="product.name" />
                <h3 class="ptitle">{{ product.title }}</h3>
                <p class="price">$ {{ product.price }}</p>
                <p class="desciption">{{ product.description }}</p>
                <div class="btndiv">
                    <button @click="addToCart(product)" class="addtocart" :class="{redbtn: cart.indexOf(product)!=-1}">Add to Basket</button>
                </div>
                </li>
            </ul>
        </div>
        <div class="showmore" @click="updateshowMore()" v-if="!showMore">
            <h3 >Show More</h3>
        </div>
    </div>
    <div>
        <div v-if="showcart" class="cartbox">
            <span aria-hidden="true" class="closebtn" @click="showcart=false"><i class="fa fa-window-close">X</i></span>
            <h2>Your Cart</h2>
            <div class="cartlist" v-if="cart.length>0">
                <div class="clist">
                    <ul>
                        <li v-for="product in cart" :key="product.id" class="catItem">
                            <img :src="product.thumbnail" alt="product.name" />
                            <span>{{ product.title }}</span>
                            <input type="number" v-model="product.quantity" min="1" :max="product.stock" class="itemcounter" @click="updateTotal(product)"/>
                            <span>$ {{ product.price }}</span>
                            <span @click="cart.splice(cart.indexOf(product), 1)">X</span>
                        </li>
                    </ul>
                </div>
                <div class="totalbox">
                    <span>Total</span>
                    <span>$ {{ cart.reduce((acc, product) => acc + product.total, 0) }}</span>
                </div>
            </div>
            <div  v-else>
                <span>Cart is Empty</span>
            </div>
        </div>
    </div>
    </div>
  </template>
  
  
  <script setup>
  import axios from 'axios'
  import { ref, onMounted, computed, onUnmounted } from 'vue'
  
  const allItems = ref([]);
  const productsList = ref([]);
  const categories = ref([]);
  const searchItem = ref('');
  const showFilter = ref(false);
  const cart = ref([]);
  const showcart = ref(false);
  const showMore = ref(false);
  const brands = ref([]);
  const price = ref([]);
  const showList = ref('');
  const selectedCategories = ref([]);
  const selectedBrands = ref([]);
  onMounted(() => {
    getProducts()
  })

  const getProducts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products')
      allItems.value = response.data.products;
      productsList.value = response.data.products.slice(0, 20);
      allItems.value.map(product => {
        if(categories.value.indexOf(product.category) === -1){
          categories.value.push(product.category)
        }
        if(brands.value.indexOf(product.brand) === -1){
          brands.value.push(product.brand)
        }
        if(price.value.indexOf(product.price) === -1){
          price.value.push(product.price)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const seachProdcut = computed(() => {
    if (!searchItem.value) {
        return productsList.value;
    }
        return productsList.value.filter(product => product.title.toLowerCase().includes(searchItem.value.toLowerCase()))
  })
  
  const sortProduct = (key) => {
    productsList.value.sort((a, b) => {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    });
  }

  const showFilterOption = () => {
    showFilter.value = !showFilter.value;
  }

  const updateSelectedCat = (category) => {
    if (category.target.checked) {
        selectedCategories.value.push(category.target.value)
    } else {
        selectedCategories.value.splice(selectedCategories.value.indexOf(category.target.value), 1)
    }
  }
  
  const updateSelectedBrand = (category) => {
    if (category.target.checked) {
        selectedBrands.value.push(category.target.value)
    } else {
        selectedBrands.value.splice(selectedBrands.value.indexOf(category.target.value), 1)
    }
  }

  const addToCart = (product) => {
    product.quantity = 1;
    product.total = product.price*product.quantity;
    cart.value.push(product)
  }
  const applyFilter = () => {
    productsList.value = productsList.value.filter(product => {
        if (selectedCategories.value.length > 0 && selectedCategories.value.indexOf(product.category) === -1) {
            return false;
        }
        if (selectedBrands.value.length > 0 && selectedBrands.value.indexOf(product.brand) === -1) {
            return false;
        }
        return true;
    });
    showFilter.value = false;
  }
const updateTotal = (product) => {
    product.total = product.price*product.quantity;
}

const clearFilter = () => {
    selectedCategories.value = [];
    selectedBrands.value = [];
    productsList.value = allItems.value.filter(product => {
        return true;
    });
    showFilter.value = false;
}

const updateFilterList = (list) => {
    if(showList.value === list)
        showList.value = '';
    else
        showList.value = list;
}

const updateshowMore = () => {
    showMore.value = !showMore.value;
    if(showMore.value){
        productsList.value = allItems.value;
    }else{
        productsList.value = allItems.value.slice(0, 20);
    }
}
  </script>

  <style scoped> 
  .plist{
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 10px 20px;
    overflow-x: auto;
  }
  .plist li{
    padding: 10px;
    margin: 10px;
    width: 23%;
  }
  .price{
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .ptitle{
    font-size: 1rem;
    font-weight: 600;
  }
  .btndiv{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .addtocart{
    background-color: #2b0fe2;
    border: none;
    border-radius: 22px;
    color: white;
    padding: 10px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .desciption {
    height: 50px;
    margin-bottom: 20px;
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
  padding: 30px;
  font-size: 2rem;
}
.searchcontainer {
  display: block;
    float: left;
    width: 100%;
}
.search{
    float: left;
    width: 50%;
    text-align: center;
}
.search input {
    width: 60%;
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.search button {
    width: 20%;
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #03451f;
    color: white;
}   

.filterbox {
    position: absolute;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
    width: 400px;
    margin-left: 900px;
    z-index: 999;
    max-height: 500px;
    overflow-y: auto;
}

.clist {
    list-style: none;
    padding: 0;
}
.catItem {
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}
.closebtn {
    float: right;
    font-size: 20px;
    cursor: pointer;
}

.cart{
    float: right;
    padding: 30px;
    font-size: 1rem;
    color: #2b0fe2;
    transition: 0.4s;
    cursor: pointer;
}
.redbtn{
    background-color: red !important;  
}
.cartbox {
    position: absolute;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
    width: 100%;
    top: 400px;
    z-index: 999;
}
.cartbox img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
.cartbox span {
    margin-right: 10px;
}
.cartbox span:last-child {
    float: right;
    color: red;
    cursor: pointer;
}
.filtergroup {
    margin: 10px;
    border-bottom: 1px solid #ccc;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}
.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.fright{
    float: right;
}

.cartlist {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.clist {
    width: 70%;
}
.totalbox {
    margin-top: 20px;
    width: 20%;
    background: gray;
    color: white;
}
.itemcounter{
    width: 50px;
    padding: 5px;
    margin: 5px;
    border-radius: 4px;
}

.showmore{
    text-align: center;
    padding: 10px;
    
    cursor: pointer;
}
.showmore:hover{
    background-color: #f9f9f9;
}
.showmore h3{
    margin: 0;
    color: red;
    border-radius: 20px;
    font-weight: 600;
}
  </style>