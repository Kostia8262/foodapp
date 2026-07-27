/* Стартовый набор блюд: по 7 завтраков/обедов/ужинов/перекусов на каждого.
   Продукты указаны по названию (не по id) — так это устойчиво к любому порядку продуктов в базе.
   Подмешивается автоматически при каждом запуске через DB.mergeDishesByName (не дублирует, не трогает
   уже добавленные вручную блюда). */
(function () {
  window.App = window.App || {};
  window.App.SEED_DISHES = [
    { name: 'Творог с черешней и миндалём', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 200 },
      { productName: 'Черешня', grams: 100 },
      { productName: 'Миндаль', grams: 10 },
    ]},
    { name: 'Омлет с овощами и сыром', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 110 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Хлеб цельнозерновой', grams: 20 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 15 },
    ]},
    { name: 'Греческий йогурт с малиной и протеином', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Греческий йогурт натуральный', grams: 250 },
      { productName: 'Малина', grams: 80 },
      { productName: 'Протеин сывороточный (порошок)', grams: 15 },
    ]},
    { name: 'Творог с голубикой и грецким орехом', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Творог 5%', grams: 180 },
      { productName: 'Голубика', grams: 80 },
      { productName: 'Грецкий орех', grams: 10 },
    ]},
    { name: 'Омлет со шпинатом и помидором', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 165 },
      { productName: 'Шпинат', grams: 50 },
      { productName: 'Помидор', grams: 50 },
    ]},
    { name: 'Овсянка на кефире с протеином и бананом', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Овсянка (сухая)', grams: 30 },
      { productName: 'Кефир 1%', grams: 200 },
      { productName: 'Протеин сывороточный (порошок)', grams: 20 },
      { productName: 'Банан', grams: 50 },
    ]},
    { name: 'Творог с апельсином и миндалём', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 200 },
      { productName: 'Апельсин', grams: 100 },
      { productName: 'Миндаль', grams: 15 },
    ]},

    { name: 'Индейка с бурым рисом и брокколи', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Индейка (филе грудки)', grams: 180 },
      { productName: 'Рис бурый (сухой)', grams: 30 },
      { productName: 'Брокколи', grams: 150 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Куриная грудка с гречкой и тушёной капустой', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Куриная грудка', grams: 200 },
      { productName: 'Гречка (сухая)', grams: 30 },
      { productName: 'Капуста белокочанная', grams: 150 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},
    { name: 'Говядина с булгуром и перцем', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Говядина (постная)', grams: 160 },
      { productName: 'Булгур (сухой)', grams: 25 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Соевый соус', grams: 10 },
    ]},
    { name: 'Лосось с рисом и кабачком', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Лосось (сёмга)', grams: 150 },
      { productName: 'Рис белый (сухой)', grams: 20 },
      { productName: 'Кабачок', grams: 200 },
    ]},
    { name: 'Кролик с гречкой и морковью', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Кролик', grams: 160 },
      { productName: 'Гречка (сухая)', grams: 20 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Креветки с киноа и овощным салатом', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Креветки варёные', grams: 220 },
      { productName: 'Киноа (сухая)', grams: 25 },
      { productName: 'Салат листовой', grams: 100 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Тунец с картофелем и огуречным салатом', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 200 },
      { productName: 'Картофель', grams: 180 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},

    { name: 'Креветки с кабачком и авокадо', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Креветки варёные', grams: 200 },
      { productName: 'Кабачок', grams: 200 },
      { productName: 'Салат листовой', grams: 50 },
      { productName: 'Авокадо', grams: 30 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Минтай со шпинатом и помидором', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Минтай', grams: 220 },
      { productName: 'Шпинат', grams: 150 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Авокадо', grams: 20 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Тунец с зелёным салатом', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 200 },
      { productName: 'Салат листовой', grams: 100 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Куриная грудка с брокколи на пару', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Куриная грудка', grams: 220 },
      { productName: 'Брокколи', grams: 200 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Соевый соус', grams: 10 },
    ]},
    { name: 'Индейка с тушёной капустой', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Индейка (филе грудки)', grams: 200 },
      { productName: 'Капуста белокочанная', grams: 150 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Креветки с перцем и авокадо', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Креветки варёные', grams: 180 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Авокадо', grams: 30 },
    ]},
    { name: 'Говядина со шпинатом и помидором', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Говядина (постная)', grams: 150 },
      { productName: 'Шпинат', grams: 150 },
      { productName: 'Помидор', grams: 100 },
    ]},

    { name: 'Протеиновый коктейль с кефиром и малиной', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Протеин сывороточный (порошок)', grams: 25 },
      { productName: 'Кефир 1%', grams: 200 },
      { productName: 'Малина', grams: 80 },
    ]},
    { name: 'Греческий йогурт с голубикой и орехом', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Греческий йогурт натуральный', grams: 150 },
      { productName: 'Голубика', grams: 60 },
      { productName: 'Грецкий орех', grams: 10 },
      { productName: 'Протеин сывороточный (порошок)', grams: 10 },
    ]},
    { name: 'Кефир с яблоком и протеином', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Кефир 1%', grams: 250 },
      { productName: 'Яблоко', grams: 100 },
      { productName: 'Протеин сывороточный (порошок)', grams: 15 },
    ]},
    { name: 'Творог с арбузом и миндалём', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 120 },
      { productName: 'Арбуз', grams: 150 },
      { productName: 'Миндаль', grams: 10 },
    ]},
    { name: 'Молочный протеиновый коктейль с черешней', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Молоко 2.5%', grams: 200 },
      { productName: 'Протеин сывороточный (порошок)', grams: 20 },
      { productName: 'Черешня', grams: 60 },
    ]},
    { name: 'Творог с дыней', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Творог 5%', grams: 150 },
      { productName: 'Дыня', grams: 100 },
    ]},
    { name: 'Кефир с протеином и грецким орехом', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Кефир 1%', grams: 200 },
      { productName: 'Протеин сывороточный (порошок)', grams: 20 },
      { productName: 'Грецкий орех', grams: 8 },
    ]},

    { name: 'Овсянка на молоке с бананом и арахисовой пастой', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Овсянка (сухая)', grams: 80 },
      { productName: 'Молоко 2.5%', grams: 250 },
      { productName: 'Банан', grams: 120 },
      { productName: 'Арахисовая паста (без сахара)', grams: 20 },
    ]},
    { name: 'Яичница с цельнозерновым хлебом, сыром и авокадо', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 220 },
      { productName: 'Хлеб цельнозерновой', grams: 60 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
      { productName: 'Авокадо', grams: 50 },
    ]},
    { name: 'Творог с мёдом, грецким орехом и бананом', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Творог 5%', grams: 200 },
      { productName: 'Мёд', grams: 20 },
      { productName: 'Грецкий орех', grams: 20 },
      { productName: 'Банан', grams: 100 },
    ]},
    { name: 'Гречка с куриным бедром и сыром', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Гречка (сухая)', grams: 70 },
      { productName: 'Куриное филе бедра', grams: 100 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
      { productName: 'Хлеб белый (батон)', grams: 20 },
    ]},
    { name: 'Жареный рис с яйцом и курицей', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Рис белый (сухой)', grams: 60 },
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 110 },
      { productName: 'Соевый соус', grams: 10 },
      { productName: 'Морковь', grams: 50 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Масло подсолнечное', grams: 8 },
      { productName: 'Куриная грудка', grams: 80 },
    ]},
    { name: 'Бутерброд с сыром и колбасой + молоко', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Хлеб белый (батон)', grams: 60 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 40 },
      { productName: 'Колбаса варёная', grams: 40 },
      { productName: 'Помидор', grams: 80 },
      { productName: 'Молоко 2.5%', grams: 200 },
    ]},
    { name: 'Творожно-овсяная каша с ягодами и мёдом', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 150 },
      { productName: 'Овсянка (сухая)', grams: 40 },
      { productName: 'Ягоды замороженные (микс)', grams: 100 },
      { productName: 'Мёд', grams: 15 },
      { productName: 'Миндаль', grams: 15 },
      { productName: 'Протеин сывороточный (порошок)', grams: 15 },
    ]},

    { name: 'Говядина с бурым рисом и брокколи (обед)', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Говядина (постная)', grams: 200 },
      { productName: 'Рис бурый (сухой)', grams: 70 },
      { productName: 'Брокколи', grams: 150 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},
    { name: 'Куриное бедро с жареной картошкой и капустой', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Куриное филе бедра', grams: 250 },
      { productName: 'Картофель', grams: 300 },
      { productName: 'Капуста белокочанная', grams: 150 },
      { productName: 'Масло подсолнечное', grams: 10 },
    ]},
    { name: 'Свинина с макаронами и помидорами', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Свинина (вырезка)', grams: 200 },
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 80 },
      { productName: 'Помидор', grams: 150 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 30 },
    ]},
    { name: 'Кролик с гречкой и морковью (порция посытнее)', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Кролик', grams: 250 },
      { productName: 'Гречка (сухая)', grams: 60 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},
    { name: 'Утка с рисом и кабачком', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Утка (мясо с кожей)', grams: 150 },
      { productName: 'Рис белый (сухой)', grams: 60 },
      { productName: 'Кабачок', grams: 200 },
    ]},
    { name: 'Лосось с булгуром и перцем', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Лосось (сёмга)', grams: 200 },
      { productName: 'Булгур (сухой)', grams: 60 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Паста с говяжьим фаршем и сыром', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Фарш говяжий 5%', grams: 220 },
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 70 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Помидор', grams: 120 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 30 },
    ]},

    { name: 'Куриная грудка с картофелем и кабачком', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Куриная грудка', grams: 250 },
      { productName: 'Картофель', grams: 250 },
      { productName: 'Кабачок', grams: 150 },
      { productName: 'Масло сливочное', grams: 10 },
      { productName: 'Сметана 15%', grams: 20 },
    ]},
    { name: 'Индейка с бурым рисом и брокколи (ужин)', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Индейка (филе грудки)', grams: 250 },
      { productName: 'Рис бурый (сухой)', grams: 60 },
      { productName: 'Брокколи', grams: 150 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},
    { name: 'Свиная отбивная с картофелем и капустой', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Свиная отбивная (корейка)', grams: 200 },
      { productName: 'Картофель', grams: 200 },
      { productName: 'Капуста белокочанная', grams: 150 },
    ]},
    { name: 'Говядина с гречкой', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Говядина (постная)', grams: 220 },
      { productName: 'Гречка (сухая)', grams: 50 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Креветки с макаронами', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Креветки варёные', grams: 250 },
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 70 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},
    { name: 'Кролик с картофельным пюре и морковью', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Кролик', grams: 220 },
      { productName: 'Картофель', grams: 220 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Сметана 15%', grams: 20 },
    ]},
    { name: 'Лосось с рисом и шпинатом', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Лосось (сёмга)', grams: 180 },
      { productName: 'Рис белый (сухой)', grams: 50 },
      { productName: 'Шпинат', grams: 100 },
    ]},

    { name: 'Творог с бананом и арахисовой пастой', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Творог 5%', grams: 200 },
      { productName: 'Банан', grams: 120 },
      { productName: 'Арахисовая паста (без сахара)', grams: 20 },
    ]},
    { name: 'Протеиновый коктейль с овсянкой и мёдом', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Протеин сывороточный (порошок)', grams: 35 },
      { productName: 'Молоко 2.5%', grams: 300 },
      { productName: 'Овсянка (сухая)', grams: 30 },
      { productName: 'Мёд', grams: 15 },
    ]},
    { name: 'Греческий йогурт с грецким орехом, мёдом и бананом', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Греческий йогурт натуральный', grams: 250 },
      { productName: 'Грецкий орех', grams: 25 },
      { productName: 'Мёд', grams: 15 },
      { productName: 'Банан', grams: 60 },
    ]},
    { name: 'Рисовые хлебцы с арахисовой пастой и бананом', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Рисовые хлебцы', grams: 40 },
      { productName: 'Арахисовая паста (без сахара)', grams: 25 },
      { productName: 'Банан', grams: 100 },
    ]},
    { name: 'Кефир с протеином, черешней и миндалём', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Кефир 1%', grams: 300 },
      { productName: 'Протеин сывороточный (порошок)', grams: 25 },
      { productName: 'Черешня', grams: 100 },
      { productName: 'Миндаль', grams: 20 },
    ]},
    { name: 'Творог с мёдом, арахисом и хлебцом', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 200 },
      { productName: 'Мёд', grams: 25 },
      { productName: 'Арахис', grams: 20 },
      { productName: 'Хлеб цельнозерновой', grams: 30 },
    ]},
    { name: 'Молочный коктейль с протеином, бананом и арахисовой пастой', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Молоко 2.5%', grams: 300 },
      { productName: 'Протеин сывороточный (порошок)', grams: 30 },
      { productName: 'Банан', grams: 100 },
      { productName: 'Арахисовая паста (без сахара)', grams: 15 },
    ]},

    { name: 'Йогурт натуральный с грушей и миндалём', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Йогурт натуральный 2%', grams: 200 },
      { productName: 'Груша', grams: 100 },
      { productName: 'Миндаль', grams: 10 },
    ]},
    { name: 'Омлет с ветчиной и помидорами черри', mealType: 'breakfast', forWho: 'her', items: [
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 110 },
      { productName: 'Ветчина', grams: 40 },
      { productName: 'Помидоры черри', grams: 100 },
    ]},
    { name: 'Куриная грудка с киноа и помидорами черри', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Куриная грудка', grams: 180 },
      { productName: 'Киноа (сухая)', grams: 30 },
      { productName: 'Помидоры черри', grams: 150 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Балык с овощным салатом и лимоном', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Балык рыбный (вяленый)', grams: 150 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Помидоры черри', grams: 100 },
      { productName: 'Салат листовой', grams: 50 },
      { productName: 'Лимон', grams: 10 },
    ]},
    { name: 'Ветчина с овощами на пару', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Ветчина', grams: 120 },
      { productName: 'Брокколи', grams: 150 },
      { productName: 'Морковь', grams: 100 },
    ]},
    { name: 'Йогурт питьевой с малиной', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Йогурт питьевой', grams: 200 },
      { productName: 'Малина', grams: 60 },
    ]},
    { name: 'Творог с лимоном и мёдом', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Творог обезжиренный 0-2%', grams: 150 },
      { productName: 'Лимон', grams: 20 },
      { productName: 'Мёд', grams: 10 },
    ]},

    { name: 'Бутерброд с ветчиной, сыром Гауда и помидором', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Хлеб цельнозерновой', grams: 60 },
      { productName: 'Ветчина', grams: 50 },
      { productName: 'Сыр Гауда', grams: 30 },
      { productName: 'Помидор', grams: 80 },
    ]},
    { name: 'Йогурт фруктовый с бананом и грецким орехом', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Йогурт фруктовый (сладкий)', grams: 250 },
      { productName: 'Банан', grams: 100 },
      { productName: 'Грецкий орех', grams: 20 },
    ]},
    { name: 'Бастурма с гречкой и овощами', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Бастурма (вяленая говядина)', grams: 100 },
      { productName: 'Гречка (сухая)', grams: 70 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},
    { name: 'Грудинка варёная с картофелем и капустой', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Грудинка варёная', grams: 180 },
      { productName: 'Картофель', grams: 250 },
      { productName: 'Капуста белокочанная', grams: 150 },
    ]},
    { name: 'Балык с рисом и овощами', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Балык рыбный (вяленый)', grams: 180 },
      { productName: 'Рис белый (сухой)', grams: 60 },
      { productName: 'Кабачок', grams: 150 },
    ]},
    { name: 'Бутерброд с рыбной намазкой', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Хлеб чёрный (ржаной)', grams: 40 },
      { productName: 'Намазка рыбная (паштет)', grams: 40 },
      { productName: 'Огурец', grams: 50 },
    ]},
    { name: 'Молоко 3.2% с протеином и бананом', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Молоко 3.2%', grams: 300 },
      { productName: 'Протеин сывороточный (порошок)', grams: 30 },
      { productName: 'Банан', grams: 100 },
    ]},

    { name: 'Паста с креветками в лёгком соусе', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 60 },
      { productName: 'Креветки варёные', grams: 200 },
      { productName: 'Масло оливковое', grams: 8 },
      { productName: 'Помидор', grams: 100 },
    ]},
    { name: 'Куриное пюре с картофелем', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Картофель', grams: 200 },
      { productName: 'Куриное филе бедра', grams: 150 },
      { productName: 'Молоко 2.5%', grams: 30 },
      { productName: 'Масло сливочное', grams: 5 },
    ]},
    { name: 'Окрошка на кефире с говядиной', mealType: 'lunch', forWho: 'her', items: [
      { productName: 'Кефир 1%', grams: 300 },
      { productName: 'Говядина (постная)', grams: 100 },
      { productName: 'Огурец', grams: 150 },
      { productName: 'Картофель', grams: 100 },
      { productName: 'Яйцо куриное (1 шт ~55г)', grams: 55 },
    ]},
    { name: 'Баранина запечённая с овощами', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Баранина', grams: 150 },
      { productName: 'Кабачок', grams: 150 },
      { productName: 'Перец болгарский', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Грибной суп с курицей', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Грибы шампиньоны', grams: 150 },
      { productName: 'Куриная грудка', grams: 100 },
      { productName: 'Картофель', grams: 150 },
      { productName: 'Морковь', grams: 50 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Курица с бататом и брокколи', mealType: 'dinner', forWho: 'her', items: [
      { productName: 'Куриная грудка', grams: 180 },
      { productName: 'Батат', grams: 200 },
      { productName: 'Брокколи', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Салат из помидоров и огурцов с оливковым маслом', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Помидор', grams: 150 },
      { productName: 'Огурец', grams: 150 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},
    { name: 'Салат из капусты со сметаной', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Капуста белокочанная', grams: 150 },
      { productName: 'Сметана 15%', grams: 20 },
    ]},

    { name: 'Бутерброд с балыком и огурцом', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Хлеб чёрный (ржаной)', grams: 50 },
      { productName: 'Балык рыбный (вяленый)', grams: 50 },
      { productName: 'Огурец', grams: 50 },
      { productName: 'Масло сливочное', grams: 10 },
    ]},
    { name: 'Бутерброд с бастурмой и помидором', mealType: 'breakfast', forWho: 'me', items: [
      { productName: 'Хлеб цельнозерновой', grams: 60 },
      { productName: 'Бастурма (вяленая говядина)', grams: 50 },
      { productName: 'Помидор', grams: 60 },
    ]},
    { name: 'Паста с креветками и сыром', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 90 },
      { productName: 'Креветки варёные', grams: 250 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},
    { name: 'Пюре с рёбрышками', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Картофель', grams: 300 },
      { productName: 'Свинина, рёбрышки', grams: 250 },
      { productName: 'Масло сливочное', grams: 15 },
      { productName: 'Молоко 2.5%', grams: 50 },
    ]},
    { name: 'Пюре с уткой', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Картофель', grams: 250 },
      { productName: 'Утка (мясо с кожей)', grams: 200 },
      { productName: 'Масло сливочное', grams: 10 },
    ]},
    { name: 'Баранина с бататом', mealType: 'lunch', forWho: 'me', items: [
      { productName: 'Баранина', grams: 220 },
      { productName: 'Батат', grams: 250 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},
    { name: 'Баранина, запечённая в духовке с картофелем', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Баранина', grams: 250 },
      { productName: 'Картофель', grams: 250 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},
    { name: 'Борщ с мясом и салом', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Говядина (постная)', grams: 150 },
      { productName: 'Сало', grams: 15 },
      { productName: 'Свёкла', grams: 150 },
      { productName: 'Капуста белокочанная', grams: 100 },
      { productName: 'Картофель', grams: 100 },
      { productName: 'Морковь', grams: 50 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Суп с фрикадельками', mealType: 'dinner', forWho: 'me', items: [
      { productName: 'Фрикадельки мясные', grams: 200 },
      { productName: 'Картофель', grams: 150 },
      { productName: 'Морковь', grams: 50 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Салат из помидоров и огурцов с оливковым маслом (большая порция)', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Помидор', grams: 200 },
      { productName: 'Огурец', grams: 200 },
      { productName: 'Масло оливковое', grams: 15 },
    ]},
    { name: 'Салат из капусты со сметаной (большая порция)', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Капуста белокочанная', grams: 200 },
      { productName: 'Сметана 15%', grams: 30 },
    ]},

    { name: 'Домашнее мороженое из сливок', mealType: 'snack', forWho: 'her', items: [
      { productName: 'Сливки 33%', grams: 100 },
      { productName: 'Сахар', grams: 15 },
    ]},
    { name: 'Домашнее мороженое из сливок (порция побольше)', mealType: 'snack', forWho: 'me', items: [
      { productName: 'Сливки 33%', grams: 150 },
      { productName: 'Сахар', grams: 20 },
    ]},

    /* ===== Парные блюда: готовится одна основа на двоих в одной сковороде/кастрюле,
       расходится по тарелкам разными порциями и добавками ===== */

    { name: 'Курица с брокколи и морковью (её порция)', mealType: 'lunch', forWho: 'her', note: 'Готовьте вместе с его порцией — общая основа, у неё меньше курицы и без риса.', items: [
      { productName: 'Куриная грудка', grams: 200 },
      { productName: 'Брокколи', grams: 200 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Курица с брокколи и морковью (его порция)', mealType: 'lunch', forWho: 'me', note: 'Готовьте вместе с её порцией — та же сковорода, плюс рис и масло.', items: [
      { productName: 'Куриная грудка', grams: 250 },
      { productName: 'Брокколи', grams: 200 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Рис бурый (сухой)', grams: 80 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},

    { name: 'Индейка с кабачком и помидором (её порция)', mealType: 'lunch', forWho: 'her', note: 'Общая основа с его порцией, без картофеля и сыра.', items: [
      { productName: 'Индейка (филе грудки)', grams: 220 },
      { productName: 'Кабачок', grams: 200 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Индейка с кабачком и помидором (его порция)', mealType: 'lunch', forWho: 'me', note: 'Общая основа с её порцией, плюс картофель и сыр.', items: [
      { productName: 'Индейка (филе грудки)', grams: 250 },
      { productName: 'Кабачок', grams: 200 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Картофель', grams: 320 },
      { productName: 'Масло оливковое', grams: 10 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
    ]},

    { name: 'Говядина с гречкой, луком и морковью (её порция)', mealType: 'lunch', forWho: 'her', note: 'Одна сковорода на двоих — у неё порция меньше.', items: [
      { productName: 'Говядина (постная)', grams: 150 },
      { productName: 'Гречка (сухая)', grams: 25 },
      { productName: 'Лук репчатый', grams: 30 },
      { productName: 'Морковь', grams: 50 },
    ]},
    { name: 'Говядина с гречкой, луком и морковью (его порция)', mealType: 'lunch', forWho: 'me', note: 'Одна сковорода на двоих — у него порция больше, плюс масло.', items: [
      { productName: 'Говядина (постная)', grams: 220 },
      { productName: 'Гречка (сухая)', grams: 70 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Морковь', grams: 60 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},

    { name: 'Лосось с рисом и шпинатом (её порция, парная)', mealType: 'lunch', forWho: 'her', note: 'Общая готовка с его порцией — у неё меньше лосося и риса.', items: [
      { productName: 'Лосось (сёмга)', grams: 130 },
      { productName: 'Рис белый (сухой)', grams: 15 },
      { productName: 'Шпинат', grams: 100 },
    ]},
    { name: 'Лосось с рисом и шпинатом (его порция, парная)', mealType: 'lunch', forWho: 'me', note: 'Общая готовка с её порцией — у него больше лосося и риса.', items: [
      { productName: 'Лосось (сёмга)', grams: 200 },
      { productName: 'Рис белый (сухой)', grams: 80 },
      { productName: 'Шпинат', grams: 100 },
    ]},

    { name: 'Креветки с макаронами и помидором (её порция)', mealType: 'lunch', forWho: 'her', note: 'Готовьте одной кастрюлей с его порцией — у неё меньше макарон.', items: [
      { productName: 'Креветки варёные', grams: 200 },
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 25 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Креветки с макаронами и помидором (его порция)', mealType: 'lunch', forWho: 'me', note: 'Готовьте одной кастрюлей с её порцией — у него больше креветок и макарон.', items: [
      { productName: 'Креветки варёные', grams: 250 },
      { productName: 'Макароны из твёрдых сортов (сухие)', grams: 80 },
      { productName: 'Помидор', grams: 120 },
      { productName: 'Масло оливковое', grams: 10 },
    ]},

    { name: 'Свинина с рисом и перцем (её порция)', mealType: 'lunch', forWho: 'her', note: 'Общая основа с его порцией, у неё меньше свинины и риса.', items: [
      { productName: 'Свинина (вырезка)', grams: 150 },
      { productName: 'Рис бурый (сухой)', grams: 25 },
      { productName: 'Перец болгарский', grams: 150 },
    ]},
    { name: 'Свинина с рисом и перцем (его порция)', mealType: 'lunch', forWho: 'me', note: 'Общая основа с её порцией, у него больше свинины, риса и масла.', items: [
      { productName: 'Свинина (вырезка)', grams: 220 },
      { productName: 'Рис бурый (сухой)', grams: 75 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},

    { name: 'Тунец с картофелем и овощами (её порция)', mealType: 'lunch', forWho: 'her', note: 'Готовьте вместе с его порцией — у неё меньше картофеля, без сыра.', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 180 },
      { productName: 'Картофель', grams: 150 },
      { productName: 'Огурец', grams: 100 },
    ]},
    { name: 'Тунец с картофелем и овощами (его порция)', mealType: 'lunch', forWho: 'me', note: 'Готовьте вместе с её порцией — у него больше картофеля, плюс масло и сыр.', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 220 },
      { productName: 'Картофель', grams: 350 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Масло оливковое', grams: 10 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
    ]},

    { name: 'Куриная грудка с брокколи и помидором (её порция)', mealType: 'dinner', forWho: 'her', note: 'Одна форма для запекания на двоих — у неё без картофеля.', items: [
      { productName: 'Куриная грудка', grams: 180 },
      { productName: 'Брокколи', grams: 200 },
      { productName: 'Помидор', grams: 100 },
    ]},
    { name: 'Куриная грудка с брокколи и помидором (его порция)', mealType: 'dinner', forWho: 'me', note: 'Одна форма для запекания на двоих — у него больше курицы, плюс картофель и масло.', items: [
      { productName: 'Куриная грудка', grams: 250 },
      { productName: 'Брокколи', grams: 200 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Картофель', grams: 200 },
      { productName: 'Масло сливочное', grams: 10 },
    ]},

    { name: 'Минтай с кабачком и морковью (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общая сковорода с его порцией — у неё без риса.', items: [
      { productName: 'Минтай', grams: 220 },
      { productName: 'Кабачок', grams: 200 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Масло оливковое', grams: 5 },
    ]},
    { name: 'Минтай с кабачком и морковью (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общая сковорода с её порцией — у него больше минтая, плюс рис.', items: [
      { productName: 'Минтай', grams: 280 },
      { productName: 'Кабачок', grams: 200 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Рис белый (сухой)', grams: 75 },
      { productName: 'Масло оливковое', grams: 8 },
    ]},

    { name: 'Говядина со шпинатом и луком (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общая сковорода с его порцией — у неё без картофеля.', items: [
      { productName: 'Говядина (постная)', grams: 150 },
      { productName: 'Шпинат', grams: 150 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Говядина со шпинатом и луком (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общая сковорода с её порцией — у него больше говядины, плюс картофель.', items: [
      { productName: 'Говядина (постная)', grams: 220 },
      { productName: 'Шпинат', grams: 150 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Картофель', grams: 200 },
    ]},

    { name: 'Креветки с перцем, огурцом и авокадо (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общая тарелка с его порцией — у неё меньше креветок и авокадо, без риса.', items: [
      { productName: 'Креветки варёные', grams: 200 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Авокадо', grams: 25 },
    ]},
    { name: 'Креветки с перцем, огурцом и авокадо (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общая тарелка с её порцией — у него больше креветок, авокадо и рис.', items: [
      { productName: 'Креветки варёные', grams: 280 },
      { productName: 'Перец болгарский', grams: 150 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Авокадо', grams: 40 },
      { productName: 'Рис белый (сухой)', grams: 65 },
    ]},

    { name: 'Индейка с тушёной капустой и картофелем (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общая кастрюля с его порцией — у неё без картофеля.', items: [
      { productName: 'Индейка (филе грудки)', grams: 220 },
      { productName: 'Капуста белокочанная', grams: 150 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Индейка с тушёной капустой и картофелем (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общая кастрюля с её порцией — у него больше индейки, плюс картофель и масло.', items: [
      { productName: 'Индейка (филе грудки)', grams: 280 },
      { productName: 'Капуста белокочанная', grams: 200 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Картофель', grams: 220 },
      { productName: 'Масло сливочное', grams: 10 },
    ]},

    { name: 'Кролик с морковью и луком (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общая сковорода с его порцией — у неё без гречки.', items: [
      { productName: 'Кролик', grams: 160 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Лук репчатый', grams: 30 },
    ]},
    { name: 'Кролик с морковью и луком (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общая сковорода с её порцией — у него больше кролика, плюс гречка.', items: [
      { productName: 'Кролик', grams: 240 },
      { productName: 'Морковь', grams: 100 },
      { productName: 'Лук репчатый', grams: 40 },
      { productName: 'Гречка (сухая)', grams: 50 },
    ]},

    { name: 'Тунец с салатом и авокадо (её порция)', mealType: 'dinner', forWho: 'her', note: 'Общий салат с его порцией — у неё меньше тунца и авокадо, без хлеба и сыра.', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 180 },
      { productName: 'Салат листовой', grams: 100 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Помидор', grams: 100 },
      { productName: 'Авокадо', grams: 25 },
    ]},
    { name: 'Тунец с салатом и авокадо (его порция)', mealType: 'dinner', forWho: 'me', note: 'Общий салат с её порцией — у него больше тунца, авокадо, плюс хлеб и сыр.', items: [
      { productName: 'Тунец консервированный (в собств. соку)', grams: 250 },
      { productName: 'Салат листовой', grams: 100 },
      { productName: 'Огурец', grams: 100 },
      { productName: 'Помидор', grams: 120 },
      { productName: 'Авокадо', grams: 50 },
      { productName: 'Хлеб цельнозерновой', grams: 60 },
      { productName: 'Сыр твёрдый (Российский тип)', grams: 20 },
    ]},
  ];
})();
