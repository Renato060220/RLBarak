import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { ShoppingCart, MessageCircle, Star, Phone, Instagram, MapPin, Heart, Search, Filter } from 'lucide-react'
import './App.css'

// Dados mockados dos produtos
const produtos = [
  {
    id: 1,
    nome: 'Sopas Gourmet',
    descricao: 'Sopas artesanais preparadas com ingredientes frescos e selecionados',
    preco: 15.00,
    categoria: 'sopas',
    empreendedor: 'Maria Silva',
    imagem: '/src/assets/products/hEZp3VhcRmS1.jpg',
    disponivel: true,
    avaliacao: 4.8
  },
  {
    id: 2,
    nome: 'Doces Finos',
    descricao: 'Doces artesanais para festas e ocasiões especiais',
    preco: 3.50,
    categoria: 'doces',
    empreendedor: 'João Santos',
    imagem: '/src/assets/products/18VKOhVDlONr.jpg',
    disponivel: true,
    avaliacao: 4.9
  },
  {
    id: 3,
    nome: 'Biscoitos Amanteigados',
    descricao: 'Biscoitos caseiros com sabor tradicional e textura perfeita',
    preco: 12.00,
    categoria: 'biscoitos',
    empreendedor: 'Ana Costa',
    imagem: '/src/assets/products/wKhneBT6rKSV.webp',
    disponivel: true,
    avaliacao: 4.7
  },
  {
    id: 4,
    nome: 'Palha Italiana',
    descricao: 'Doce tradicional com chocolate e biscoito, irresistível',
    preco: 8.00,
    categoria: 'doces',
    empreendedor: 'Carlos Lima',
    imagem: '/src/assets/products/2vnDfACHr9uI.jpg',
    disponivel: true,
    avaliacao: 4.6
  },
  {
    id: 5,
    nome: 'Suspiros Coloridos',
    descricao: 'Suspiros delicados em diversas cores e sabores',
    preco: 10.00,
    categoria: 'doces',
    empreendedor: 'Lucia Ferreira',
    imagem: '/src/assets/products/SZVW8XI9clmv.jpg',
    disponivel: true,
    avaliacao: 4.8
  },
  {
    id: 6,
    nome: 'Brownies Premium',
    descricao: 'Brownies de chocolate com textura úmida e sabor intenso',
    preco: 6.00,
    categoria: 'doces',
    empreendedor: 'Pedro Oliveira',
    imagem: '/src/assets/products/BsEgumWYQaki.jpg',
    disponivel: true,
    avaliacao: 4.9
  },
  {
    id: 7,
    nome: 'Cookies Caseiros',
    descricao: 'Cookies com gotas de chocolate, crocantes por fora e macios por dentro',
    preco: 4.00,
    categoria: 'cookies',
    empreendedor: 'Rita Souza',
    imagem: '/src/assets/products/AyPo0M4jqn2l.jpg',
    disponivel: true,
    avaliacao: 4.7
  }
]

const categorias = [
  { id: 'todos', nome: 'Todos' },
  { id: 'sopas', nome: 'Sopas' },
  { id: 'doces', nome: 'Doces' },
  { id: 'biscoitos', nome: 'Biscoitos' },
  { id: 'cookies', nome: 'Cookies' }
]

function Header({ carrinho, setMostrarCarrinho }) {
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0)

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-primary">
              RLBarak
            </h1>
            <Badge variant="secondary" className="hidden md:inline-flex text-xs">
              Marketplace
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => setMostrarCarrinho(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItens > 0 && (
                <span className="cart-badge">{totalItens}</span>
              )}
            </Button>
            
            <Button
              size="sm"
              onClick={() => window.open('https://wa.me/5581999999999?text=Olá! Gostaria de fazer um pedido.', '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contato
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero-gradient text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Marketplace Local
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Conectando você aos melhores empreendedores da sua região
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="font-medium">
            Explorar Produtos
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary font-medium">
            <Phone className="h-4 w-4 mr-2" />
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  )
}

function SecaoBusca({ 
  termoBusca, 
  setTermoBusca, 
  categoriaFiltro, 
  setCategoriaFiltro, 
  faixaPreco, 
  setFaixaPreco,
  mostrarFiltros,
  setMostrarFiltros 
}) {
  return (
    <div className="search-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos ou empreendedores..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 h-12 px-6"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        
        {mostrarFiltros && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Categoria</label>
                <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">
                  Preço: R$ {faixaPreco[0]} - R$ {faixaPreco[1]}
                </label>
                <Slider
                  value={faixaPreco}
                  onValueChange={setFaixaPreco}
                  max={20}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTermoBusca('')
                    setCategoriaFiltro('todos')
                    setFaixaPreco([0, 20])
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FiltroCategoria({ categoriaAtiva, setCategoriaAtiva }) {
  return (
    <div className="category-filter">
      {categorias.map(categoria => (
        <button
          key={categoria.id}
          className={`category-button ${categoriaAtiva === categoria.id ? 'active' : ''}`}
          onClick={() => setCategoriaAtiva(categoria.id)}
        >
          {categoria.nome}
        </button>
      ))}
    </div>
  )
}

function CardProduto({ produto, adicionarAoCarrinho }) {
  const [curtido, setCurtido] = useState(false)

  const renderEstrelas = (avaliacao) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(avaliacao) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <Card className="product-card fade-in">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm"
            onClick={() => setCurtido(!curtido)}
          >
            <Heart className={`h-4 w-4 ${curtido ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CardTitle className="text-lg mb-2 font-semibold">{produto.nome}</CardTitle>
        <CardDescription className="text-sm mb-3 text-muted-foreground">
          {produto.descricao}
        </CardDescription>
        
        <div className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">Por:</span> {produto.empreendedor}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="rating-stars">
            {renderEstrelas(produto.avaliacao)}
          </div>
          <span className="text-sm text-muted-foreground">
            ({produto.avaliacao})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            R$ {produto.preco.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          onClick={() => adicionarAoCarrinho(produto)}
          disabled={!produto.disponivel}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {produto.disponivel ? 'Adicionar' : 'Indisponível'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function Carrinho({ carrinho, setCarrinho, mostrar, setMostrar }) {
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)

  const removerItem = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id))
  }

  const atualizarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade === 0) {
      removerItem(id)
      return
    }
    
    setCarrinho(prev => prev.map(item =>
      item.id === id ? { ...item, quantidade: novaQuantidade } : item
    ))
  }

  const finalizarPedido = () => {
    const itens = carrinho.map(item => 
      `${item.nome} (${item.quantidade}x) - R$ ${item.preco.toFixed(2)} - ${item.empreendedor}`
    ).join('\n')
    
    const mensagem = `🛒 *Novo Pedido - RLBarak*\n\n📋 *Itens:*\n${itens}\n\n💰 *Total: R$ ${total.toFixed(2)}*\n\nGostaria de finalizar este pedido!`
    
    window.open(`https://wa.me/5581999999999?text=${encodeURIComponent(mensagem)}`, '_blank')
  }

  if (!mostrar) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden slide-up">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Carrinho</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setMostrar(false)}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto p-0">
          {carrinho.length === 0 ? (
            <div className="empty-state">
              <h3>Carrinho vazio</h3>
              <p>Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="space-y-0">
              {carrinho.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-4 border-b last:border-b-0">
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.nome}</h4>
                    <p className="text-xs text-muted-foreground">{item.empreendedor}</p>
                    <p className="text-sm font-semibold text-primary">
                      R$ {item.preco.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantidade}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        {carrinho.length > 0 && (
          <CardFooter className="flex-col gap-4 border-t">
            <div className="flex justify-between w-full text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={finalizarPedido}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Finalizar Pedido
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

function SistemaAvaliacao() {
  const [avaliacao, setAvaliacao] = useState(0)
  const [comentario, setComentario] = useState('')
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      avaliacao: 5,
      comentario: 'Produtos excelentes! Recomendo muito.',
      data: '2024-01-15'
    },
    {
      id: 2,
      nome: 'João Santos',
      avaliacao: 4,
      comentario: 'Ótima qualidade e atendimento.',
      data: '2024-01-10'
    }
  ])

  const enviarAvaliacao = () => {
    if (avaliacao > 0 && comentario.trim()) {
      const novaAvaliacao = {
        id: Date.now(),
        nome: 'Cliente',
        avaliacao,
        comentario,
        data: new Date().toISOString().split('T')[0]
      }
      setAvaliacoes(prev => [novaAvaliacao, ...prev])
      setAvaliacao(0)
      setComentario('')
    }
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Avaliações
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Deixe sua Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sua Avaliação
                </label>
                <div className="rating-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`rating-star h-6 w-6 cursor-pointer ${i < avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      onClick={() => setAvaliacao(i + 1)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comentário
                </label>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Conte-nos sobre sua experiência..."
                  rows={4}
                />
              </div>
              
              <Button onClick={enviarAvaliacao} className="w-full">
                Enviar Avaliação
              </Button>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comentários Recentes</h3>
            {avaliacoes.map(avaliacao => (
              <Card key={avaliacao.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{avaliacao.nome}</span>
                    <div className="rating-stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < avaliacao.avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {avaliacao.comentario}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              RLBarak
            </h3>
            <p className="text-sm opacity-90 mb-6">
              Marketplace que conecta empreendedores locais aos clientes, promovendo o comércio da sua região.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
              <Button variant="secondary" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(81) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Pernambuco, Brasil</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Sopas Gourmet</li>
              <li>Doces Artesanais</li>
              <li>Biscoitos Caseiros</li>
              <li>Cookies Especiais</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2024 RLBarak - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5581999999999?text=Olá! Gostaria de saber mais sobre os produtos."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [carrinho, setCarrinho] = useState([])
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false)
  
  // Estados para busca e filtros
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos')
  const [faixaPreco, setFaixaPreco] = useState([0, 20])
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Filtrar produtos baseado na busca e filtros
  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      produto.empreendedor.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      produto.descricao.toLowerCase().includes(termoBusca.toLowerCase())
    
    const matchCategoria = categoriaFiltro === 'todos' || produto.categoria === categoriaFiltro
    const matchPreco = produto.preco >= faixaPreco[0] && produto.preco <= faixaPreco[1]
    
    return matchBusca && matchCategoria && matchPreco
  })

  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === produto.id)
      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        carrinho={carrinho} 
        setMostrarCarrinho={setMostrarCarrinho} 
      />
      
      <Hero />
      
      <SecaoBusca
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        faixaPreco={faixaPreco}
        setFaixaPreco={setFaixaPreco}
        mostrarFiltros={mostrarFiltros}
        setMostrarFiltros={setMostrarFiltros}
      />
      
      <main className="container mx-auto px-4 py-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            Produtos Disponíveis
          </h2>
          
          <FiltroCategoria 
            categoriaAtiva={categoriaAtiva}
            setCategoriaAtiva={setCategoriaAtiva}
          />
          
          {produtosFiltrados.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros de busca</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setTermoBusca('')
                  setCategoriaFiltro('todos')
                  setFaixaPreco([0, 20])
                  setCategoriaAtiva('todos')
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados.map(produto => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  adicionarAoCarrinho={adicionarAoCarrinho}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <SistemaAvaliacao />
      
      <Footer />
      
      <WhatsAppFloat />
      
      <Carrinho
        carrinho={carrinho}
        setCarrinho={setCarrinho}
        mostrar={mostrarCarrinho}
        setMostrar={setMostrarCarrinho}
      />
    </div>
  )
}

export default App

