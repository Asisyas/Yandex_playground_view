# Yandex playground (Гипервизор)

Позволяет запускать сторонний код в песочнице. 

 <a href="http://ya-play.16mb.com/build/" target="_blank"> Демо </a>
 
 <a href="http://ya-play.16mb.com/api/#ya" target="_blank"> Онлайн документация для разработчика </a>
 
 <a href="http://ya-play.16mb.com/test/" target="_blank"> Юнит-тесты </a>

## Ограничения:

 - Пользовательский код не имеет доступа к LocalStorage, Window, Cookie и т.д.
 - Html результат кода не имеет возможности выполнять JS
 - Сторонние данные код может получать только средствами API между песочницей и основным кодом.
 
## Установка

<pre>
$ git clone --recursive https://github.com/Asisyas/Yandex_playground_view.git YandexPlayground
$ cd YandexPlayground/ya/Yandex/
$ ./generate.py [build, api, test]
</pre>

## Структура директорий
 - <b>source</b>  - Исходные файлы проекта
 - <b>build</b>   - Релиз
 - <b>test</b>    - Юнит-тесты
 - <b>api</b>     - Документация 




