package com.catalogo.loja;

import com.catalogo.loja.model.Categoria;
import com.catalogo.loja.model.Equipe;
import com.catalogo.loja.model.Item;
import com.catalogo.loja.repository.CategoriaRepository;
import com.catalogo.loja.repository.EquipeRepository;
import com.catalogo.loja.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LojaBrinquedosApplication {

	public static void main(String[] args) {
		SpringApplication.run(LojaBrinquedosApplication.class, args);
	}

	@Bean
	public CommandLineRunner inicializarDados(CategoriaRepository categoriaRepo,
											  ItemRepository itemRepo,
											  EquipeRepository equipeRepo) {
		return args -> {
			// Limpa o banco para evitar duplicados ao reiniciar
			itemRepo.deleteAll();
			categoriaRepo.deleteAll();
			equipeRepo.deleteAll();

			// --- 1. CATEGORIAS (Caminho corrigido para a pasta 'images') ---
			Categoria catCarrinhos = new Categoria();
			catCarrinhos.setNomeCategoria("Carrinhos");
			catCarrinhos.setImgCategoria("images/cat-carrinhos.png");
			categoriaRepo.save(catCarrinhos);

			Categoria catPelucias = new Categoria();
			catPelucias.setNomeCategoria("Pelúcias");
			catPelucias.setImgCategoria("images/cat-pelucias.png");
			categoriaRepo.save(catPelucias);

			Categoria catBlocos = new Categoria();
			catBlocos.setNomeCategoria("Blocos de Montar");
			catBlocos.setImgCategoria("images/cat-blocos.png");
			categoriaRepo.save(catBlocos);

			Categoria catArtes = new Categoria();
			catArtes.setNomeCategoria("Artes");
			catArtes.setImgCategoria("images/cat-artes.png");
			categoriaRepo.save(catArtes);

			Categoria catLancadores = new Categoria();
			catLancadores.setNomeCategoria("Lançadores");
			catLancadores.setImgCategoria("images/cat-lancadores.png");
			categoriaRepo.save(catLancadores);

			Categoria catQuebraCabeca = new Categoria();
			catQuebraCabeca.setNomeCategoria("Quebra-cabeças");
			catQuebraCabeca.setImgCategoria("images/cat-quebra-cabeca.png");
			categoriaRepo.save(catQuebraCabeca);

			// --- 2. BRINQUEDOS (Itens - Caminho corrigido para 'images') ---
			
			// Carrinhos
			salvarItem(itemRepo, "CAR-01", "Carrinho com Controle Remoto - Marvel", "Maisto", 189.90, "images/carrinho-marvel.png", true, "Explore a empolgação do Veículo Controle Remoto 3 funções Homem-Aranha. Inspirado no herói aracnídeo, oferece três funções distintas: para frente, para trás e parado.", catCarrinhos);
			salvarItem(itemRepo, "CAR-02", "Pista De Percurso - Hot Wheels ", "Mattel", 249.00, "images/pista-percurso.png", false, "Você pode acelerar pelo lugar mais doce de Hot Wheels City com a Hot Wheels Loja de doces.", catCarrinhos);

			// Pelúcias
			salvarItem(itemRepo, "PEL-01", "Pelúcia - Kiki Cones", "Kiki", 150.00, "images/pelucia-kiki.png", true, "Descubra a diversão com as Kiki Cones Pelúcias Sortidas da Fun Divirta-se! Estas adoráveis pelúcias no cone são perfeitas para crianças de todas as idades.", catPelucias);
			salvarItem(itemRepo, "PEL-02", "Stitch Pelúcia", "Disney", 110.00, "images/pelucia-stitch.png", false, "Pelúcia macia do personagem Stitch.", catPelucias);

			// Blocos de Montar
			salvarItem(itemRepo, "BLO-01", "LEGO - Minecraft - A Casa Porco Bebê", "Lego", 350.00, "images/lego-porco.png", true, "A Casa Porco Bebê é o brinquedo ideal para jogadores de Minecraft® com uma paixão por construir casas, animais e fazendas.", catBlocos);
			salvarItem(itemRepo, "BLO-02", "Lego - Lego Creator - Ônibus Espacial", "Lego", 420.00, "images/lego-onibus.png", false, "Curta aventuras intergalácticas incríveis com 3 brinquedos espaciais LEGO® em 1 conjunto.", catBlocos);

			// Artes
			salvarItem(itemRepo, "ART-01", "Conjunto Massa de Modelar", "Play-doh", 85.00, "images/conjunto-massa.png", true, "Muita imaginação com o kit Sorveteria Colorida! Basta inserir 2 ou mais cores Play-Doh no brinquedo e pressionar a manivela para ver a taça girando e a massa descendo como se fosse um sorvete.", catArtes);
			salvarItem(itemRepo, "ART-02", "Conjunto de Artes - Painel e Acessórios", "Fun", 59.90, "images/conjunto-artes.png", false, "Hora de Criar e desenhar os seus Personagens favoritos da Disney com a Linha de Kits de Pintura da Fun!", catArtes);

			// Lançadores
			salvarItem(itemRepo, "LAN-01", "Lançador De Dardos 2.0", "Hasbro", 130.00, "images/lancador-dardos.png", true, "Lançador com tambor giratório para 12 dardos.", catLancadores);
			salvarItem(itemRepo, "LAN-02", "Lançador - Hot Wheels Cityr", "Mattel", 89.00, "images/lancador-hot.png", false, "Os lançadores Hot Wheels® Dino e Hot Wheels® Tubarão trazem um t-rex e um tubarão na forma de incríveis lançadores e obstáculos do mundo Hot Wheels™ City.", catLancadores);

			// Quebra-cabeças
			salvarItem(itemRepo, "QC-01", "Quebra-Cabeça Barbie - 50 peças", "Grow", 65.00, "images/quebra-barbie.png", false, "Um lindo quebra-cabeça que traz para você a Barbie e seu unicórnio.", catQuebraCabeca);
			salvarItem(itemRepo, "QC-02", "Quebra-Cabeça Homem Aranha - 60 Peças ", "Marvel", 98.00, "images/quebra-aranha.png", true, "Divirta-se montando esse quebra-cabeça de 60 peças de Spidey e seus amigos!", catQuebraCabeca);

			// --- 3. EQUIPE ---
			Equipe dev1 = new Equipe();
			dev1.setNome("Seu Nome Aqui");
			dev1.setRgm("12345678");
			dev1.setFoto("images/perfil-dev.png");
			equipeRepo.save(dev1);

			System.out.println("✅ Banco de dados populado com caminhos para a pasta 'images'!");
		};
	}

	private void salvarItem(ItemRepository repo, String cod, String desc, String marca, Double valor, String img, Boolean destaque, String detalhes, Categoria cat) {
		Item item = new Item();
		item.setCodigoDoBrinquedo(cod);
		item.setDescricao(desc);
		item.setMarca(marca);
		item.setValor(valor);
		item.setImagemUrl(img);
		item.setDestaque(destaque);
		item.setDetalhes(detalhes);
		item.setCategoria(cat);
		repo.save(item);
	}
}