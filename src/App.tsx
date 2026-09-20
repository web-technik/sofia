import { useState, useMemo, useCallback } from 'react';

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string;
  weight: string;
  image: string;
  badge?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Product Data
const products: Product[] = [
  {
    id: 1,
    name: 'Торт «Золотая Симфония»',
    category: 'Торты',
    price: 4500,
    description: 'Роскошный трёхъярусный торт с золотым декором, ванильным муссом и карамельной начинкой',
    details: 'Натуральный ванильный бисквит, воздушный мусс на основе белгийского шоколада, хрустящий слой карамелизированного фундука. Декорирован сусальным золотом и живыми цветами.',
    weight: '2.5 кг',
    image: '🎂',
    badge: 'Хит продаж'
  },
  {
    id: 2,
    name: 'Эклеры «Парижская Коллекция»',
    category: 'Пирожные',
    price: 890,
    description: 'Набор из 6 эклеров с разными вкусами: ваниль, фисташка, шоколад, малина, карамель, кофе',
    details: 'Заварное тесто ручной работы, начинка из натурального крема на основе маскарпоне. Каждый эклер — уникальное сочетание вкусов и текстур. Покрыты зеркальной глазурью.',
    weight: '600 г (6 шт)',
    image: '🥐',
    badge: 'Новинка'
  },
  {
    id: 3,
    name: 'Макарон «Версаль»',
    category: 'Макарон',
    price: 1200,
    description: 'Коллекция из 12 макарон премиум-класса в подарочной шкатулке',
    details: 'Миндальная мука из Прованса, натуральные красители, начинки из бельгийского шоколада, сицилийских фисташек, мадагаскарской ванили. Идеальный подарок для ценителей.',
    weight: '240 г (12 шт)',
    image: '🧁',
    badge: 'Премиум'
  },
  {
    id: 4,
    name: 'Чизкейк «Бархатный Вечер»',
    category: 'Торты',
    price: 3800,
    description: 'Нежнейший чизкейк на основе филадельфии с ягодным кули и белым шоколадом',
    details: 'Основа из песочного печенья, крем из сыра Филадельфия премиум-класса, зеркальная глазурь из белого шоколада, декор из свежих ягод и съедобных цветов.',
    weight: '1.8 кг',
    image: '🍰',
  },
  {
    id: 5,
    name: 'Трюфели «Императорские»',
    category: 'Конфеты',
    price: 2400,
    description: 'Ручные шоколадные трюфели из бельгийского шоколада с начинками',
    details: 'Корпус из темперированного бельгийского шоколада Callebaut. Начинки: пралине, ганаш, карамель с морской солью, ягодный конфитюр. Подаются в бархатной коробке.',
    weight: '300 г (16 шт)',
    image: '🍫',
    badge: 'Подарочный'
  },
  {
    id: 6,
    name: 'Круассаны «Утренний Бриз»',
    category: 'Выпечка',
    price: 650,
    description: 'Воздушные круассаны из слоёного теста на французском масле, набор 4 штуки',
    details: 'Тесто ручной работы с 27 слоями, выдержанное 72 часа. Французское масло 82% жирности. Возможны начинки: миндальный крем, шоколад, ветчина и сыр.',
    weight: '400 г (4 шт)',
    image: '🥖',
  },
];

const categories = ['Все', 'Торты', 'Пирожные', 'Макарон', 'Конфеты', 'Выпечка'];

// Main App Component
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null as any;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => {
      setOrderPlaced(false);
      setIsCheckout(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold-200/20 to-cream-300/20 blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-chocolate-100/20 to-gold-100/20 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-serif text-xl font-bold">С</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-chocolate-800 tracking-wide">
                  Студия десертов
                </h1>
                <p className="text-xs text-gold-600 tracking-[0.3em] uppercase font-sans">София</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#catalog" className="text-chocolate-700 hover:text-gold-600 transition-colors font-sans text-sm tracking-wide">Каталог</a>
              <a href="#about" className="text-chocolate-700 hover:text-gold-600 transition-colors font-sans text-sm tracking-wide">О нас</a>
              <a href="#delivery" className="text-chocolate-700 hover:text-gold-600 transition-colors font-sans text-sm tracking-wide">Доставка</a>
              <a href="#contacts" className="text-chocolate-700 hover:text-gold-600 transition-colors font-sans text-sm tracking-wide">Контакты</a>
            </nav>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-chocolate-700 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <p className="text-gold-500 font-sans text-sm tracking-[0.4em] uppercase mb-4">Искусство сладкой жизни</p>
            <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-chocolate-800 mb-6 leading-tight">
              <span className="gold-shimmer">Студия десертов</span>
              <br />
              <span className="text-chocolate-700">София</span>
            </h2>
            <p className="font-sans text-lg sm:text-xl text-chocolate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Создаём десерты, которые превращают каждый момент в незабываемое событие. 
              Ручная работа, натуральные ингредиенты, безупречный вкус.
            </p>
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 btn-luxury px-8 py-4 rounded-full font-sans text-sm tracking-wider uppercase"
            >
              Смотреть каталог
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-32 left-10 text-5xl animate-float opacity-20 hidden lg:block">✨</div>
          <div className="absolute top-48 right-16 text-4xl animate-float opacity-20 hidden lg:block" style={{ animationDelay: '1s' }}>🌸</div>
          <div className="absolute bottom-20 left-20 text-4xl animate-float opacity-20 hidden lg:block" style={{ animationDelay: '2s' }}>🍰</div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-gold-500 font-sans text-sm tracking-[0.3em] uppercase mb-2">Наши изделия</p>
            <h3 className="font-serif text-4xl sm:text-5xl text-chocolate-800 font-light">Каталог десертов</h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Поиск десертов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gold-200/50 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50 outline-none font-sans text-chocolate-700 placeholder:text-chocolate-300 transition-all shadow-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full font-sans text-sm tracking-wide transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-white shadow-lg shadow-gold-300/30'
                      : 'bg-white/70 text-chocolate-600 border border-gold-200/50 hover:border-gold-400 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="luxury-card rounded-3xl overflow-hidden cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image Area */}
                <div className="relative h-56 bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center overflow-hidden">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </span>
                  {product.badge && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-gold-400 to-gold-600 text-white text-xs font-sans font-medium rounded-full tracking-wide shadow-md">
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-xl font-semibold text-chocolate-800 leading-tight pr-2">
                      {product.name}
                    </h4>
                  </div>
                  <p className="text-sm text-chocolate-500 font-sans leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-serif font-bold text-gold-600">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-xs text-chocolate-400 font-sans ml-2">/ {product.weight}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="p-3 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-110 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="font-serif text-2xl text-chocolate-600">Ничего не найдено</p>
              <p className="font-sans text-chocolate-400 mt-2">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold-500 font-sans text-sm tracking-[0.3em] uppercase mb-2">О нашей студии</p>
              <h3 className="font-serif text-4xl text-chocolate-800 font-light mb-6">Традиции вкуса с 2018 года</h3>
              <p className="font-sans text-chocolate-600 leading-relaxed mb-4">
                Студия десертов «София» — это место, где каждый десерт создаётся с любовью и вниманием к деталям. 
                Мы используем только натуральные ингредиенты высшего качества от проверенных поставщиков.
              </p>
              <p className="font-sans text-chocolate-600 leading-relaxed mb-6">
                Наши кондитеры — мастера своего дела, прошедшие обучение в лучших кулинарных школах Франции и Бельгии. 
                Каждый десерт — это произведение искусства.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-white/60 border border-gold-100">
                  <p className="font-serif text-3xl font-bold text-gold-600">7+</p>
                  <p className="text-xs text-chocolate-500 font-sans mt-1">Лет опыта</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/60 border border-gold-100">
                  <p className="font-serif text-3xl font-bold text-gold-600">5000+</p>
                  <p className="text-xs text-chocolate-500 font-sans mt-1">Заказов</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/60 border border-gold-100">
                  <p className="font-serif text-3xl font-bold text-gold-600">100%</p>
                  <p className="text-xs text-chocolate-500 font-sans mt-1">Натурально</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-cream-200 to-gold-100 flex items-center justify-center shadow-2xl">
                <span className="text-[150px] animate-float">🎂</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl">
                <span className="text-4xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section id="delivery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-500 font-sans text-sm tracking-[0.3em] uppercase mb-2">Условия</p>
            <h3 className="font-serif text-4xl text-chocolate-800 font-light">Доставка и оплата</h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚗', title: 'Доставка', desc: 'По Москве и МО от 2 часов' },
              { icon: '💳', title: 'Оплата', desc: 'Карта, наличные, СБП' },
              { icon: '📦', title: 'Упаковка', desc: 'Премиальная подарочная' },
              { icon: '🎀', title: 'Декор', desc: 'Индивидуальное оформление' },
            ].map((item, i) => (
              <div key={i} className="luxury-card rounded-2xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h4 className="font-serif text-lg font-semibold text-chocolate-800 mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-chocolate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-500 font-sans text-sm tracking-[0.3em] uppercase mb-2">Свяжитесь с нами</p>
          <h3 className="font-serif text-4xl text-chocolate-800 font-light mb-6">Контакты</h3>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-8"></div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/60 border border-gold-100">
              <span className="text-3xl mb-3 block">📞</span>
              <p className="font-sans text-sm text-chocolate-500 mb-1">Телефон</p>
              <p className="font-serif text-lg text-chocolate-800">+7 (495) 123-45-67</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/60 border border-gold-100">
              <span className="text-3xl mb-3 block">📍</span>
              <p className="font-sans text-sm text-chocolate-500 mb-1">Адрес</p>
              <p className="font-serif text-lg text-chocolate-800">Москва, ул. Тверская, 15</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/60 border border-gold-100">
              <span className="text-3xl mb-3 block">🕐</span>
              <p className="font-sans text-sm text-chocolate-500 mb-1">Режим работы</p>
              <p className="font-serif text-lg text-chocolate-800">Ежедневно 9:00–21:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gold-200/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="text-white font-serif text-sm font-bold">С</span>
            </div>
            <span className="font-serif text-lg text-chocolate-700">Студия десертов София</span>
          </div>
          <p className="font-sans text-sm text-chocolate-400">© 2024 Все права защищены. Создано с любовью ❤️</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-chocolate-900/50 backdrop-blur-sm"></div>
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-chocolate-600 hover:text-chocolate-800 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Product Image */}
            <div className="h-64 sm:h-72 bg-gradient-to-br from-cream-100 to-gold-100 flex items-center justify-center relative">
              <span className="text-[120px]">{selectedProduct.image}</span>
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 px-4 py-1.5 bg-gradient-to-r from-gold-400 to-gold-600 text-white text-sm font-sans font-medium rounded-full tracking-wide shadow-md">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gold-500 font-sans tracking-[0.2em] uppercase mb-1">{selectedProduct.category}</p>
                  <h3 className="font-serif text-3xl font-semibold text-chocolate-800">{selectedProduct.name}</h3>
                </div>
              </div>

              <p className="font-sans text-chocolate-600 leading-relaxed mb-4">
                {selectedProduct.description}
              </p>

              <div className="bg-cream-50 rounded-2xl p-5 mb-6 border border-gold-100/50">
                <p className="font-sans text-sm text-chocolate-500 leading-relaxed">
                  {selectedProduct.details}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-chocolate-400 font-sans mb-1">Вес: {selectedProduct.weight}</p>
                  <p className="text-3xl font-serif font-bold text-gold-600">
                    {selectedProduct.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="btn-luxury px-8 py-4 rounded-full font-sans text-sm tracking-wider uppercase flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-chocolate-900/40 backdrop-blur-sm" onClick={() => { setIsCartOpen(false); setIsCheckout(false); }}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Cart Header */}
            <div className="p-6 border-b border-gold-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-chocolate-800">
                  {isCheckout ? 'Оформление заказа' : 'Корзина'}
                </h3>
                {!isCheckout && (
                  <p className="text-sm text-chocolate-400 font-sans">{cartCount} {cartCount === 1 ? 'товар' : cartCount < 5 ? 'товара' : 'товаров'}</p>
                )}
              </div>
              <button
                onClick={() => { setIsCartOpen(false); setIsCheckout(false); }}
                className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-chocolate-600 hover:bg-cream-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderPlaced ? (
                <div className="flex flex-col items-center justify-center h-full text-center animate-scale-in">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 animate-pulse-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-2xl text-chocolate-800 mb-2">Заказ оформлен!</h4>
                  <p className="font-sans text-chocolate-500">Мы свяжемся с вами в ближайшее время для подтверждения</p>
                </div>
              ) : isCheckout ? (
                <CheckoutForm cart={cart} cartTotal={cartTotal} onPlaceOrder={handlePlaceOrder} onBack={() => setIsCheckout(false)} />
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="font-serif text-xl text-chocolate-600 mb-2">Корзина пуста</p>
                  <p className="font-sans text-sm text-chocolate-400">Добавьте десерты из каталога</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-cream-50 border border-gold-100/50">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cream-100 to-gold-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{item.product.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-sm font-semibold text-chocolate-800 truncate">{item.product.name}</h5>
                        <p className="font-sans text-sm text-gold-600 font-medium">
                          {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-8 h-8 rounded-full bg-white border border-gold-200 flex items-center justify-center text-chocolate-600 hover:border-gold-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-sans text-sm font-medium text-chocolate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gold-200 flex items-center justify-center text-chocolate-600 hover:border-gold-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-chocolate-300 hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {!isCheckout && !orderPlaced && cart.length > 0 && (
              <div className="p-6 border-t border-gold-100 bg-cream-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-chocolate-600">Итого:</span>
                  <span className="font-serif text-2xl font-bold text-gold-600">
                    {cartTotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full btn-luxury py-4 rounded-full font-sans text-sm tracking-wider uppercase"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Checkout Form Component
function CheckoutForm({ cart, cartTotal, onPlaceOrder, onBack }: {
  cart: CartItem[];
  cartTotal: number;
  onPlaceOrder: () => void;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-cream-50 rounded-2xl p-4 border border-gold-100/50">
        <h5 className="font-serif text-lg text-chocolate-800 mb-3">Ваш заказ</h5>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-chocolate-600 font-sans truncate pr-4">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-chocolate-800 font-medium font-sans flex-shrink-0">
                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gold-200/50 mt-3 pt-3 flex justify-between">
          <span className="font-sans text-chocolate-700 font-medium">Итого:</span>
          <span className="font-serif text-xl font-bold text-gold-600">
            {cartTotal.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-sans text-chocolate-600 mb-1.5">Ваше имя *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Введите ваше имя"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gold-200/50 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50 outline-none font-sans text-chocolate-700 placeholder:text-chocolate-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-sans text-chocolate-600 mb-1.5">Телефон *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+7 (___) ___-__-__"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gold-200/50 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50 outline-none font-sans text-chocolate-700 placeholder:text-chocolate-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-sans text-chocolate-600 mb-1.5">Адрес доставки *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Улица, дом, квартира"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gold-200/50 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50 outline-none font-sans text-chocolate-700 placeholder:text-chocolate-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-sans text-chocolate-600 mb-1.5">Комментарий к заказу</label>
          <textarea
            value={formData.comment}
            onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Пожелания к оформлению, время доставки..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gold-200/50 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50 outline-none font-sans text-chocolate-700 placeholder:text-chocolate-300 transition-all resize-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          type="submit"
          className="w-full btn-luxury py-4 rounded-full font-sans text-sm tracking-wider uppercase"
        >
          Подтвердить заказ
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-full font-sans text-sm text-chocolate-500 border border-gold-200/50 hover:border-gold-400 transition-colors"
        >
          ← Вернуться в корзину
        </button>
      </div>
    </form>
  );
}
