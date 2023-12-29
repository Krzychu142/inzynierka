# Testy Aplikacji

Poniżej znajdują się scenariusze testowe wybranych funkcjonalności aplikacji.

## Spis Treści

- [T001: Logowanie do aplikacji](#t001-logowanie-do-aplikacji)
- [T002: Wylogowanie z aplikacji](#t002-wylogowanie-z-aplikacji)
- [T003: Dodawanie nowego produktu](#t003-dodawanie-nowego-produktu)
- [T004: Wyszukiwanie produktu po nazwie](#t004-wyszukiwanie-produktu-po-nazwie)
- [T005: Generowanie podsumowania PDF zamówienia](#t005-generowanie-podsumowania-pdf-zamówienia)
- [T006: Dodawanie nowego pracownika](#t006-dodawanie-nowego-pracownika)
- [T007: Wyszukiwanie pracowników po email](#t007-wyszukiwanie-pracowników-po-email)
- [T008: Edycja danych pracownika](#t008-edycja-danych-pracownika)
- [T009: Edycja danych pracownika](#t009-edycja-danych-pracownika)
- [T010: Resetowanie hasła](#t010-resetowanie-hasła)

---

## T001: Logowanie do aplikacji

### Opis testu

Sprawdzenie, czy użytkownik może się zalogować do aplikacji, przy użyciu prawidłowych danych.

### Warunki wstępne

W aplikacji musi istnieć konto o podanych danych.

### Kroki testu

1. Wejdź na główny adres aplikacji.
2. Naciśnij na przycisk LogIn.
3. W formularzu prawidłowo wprowadź dane - odpowiednio email oraz hasło.
4. Naciśnij przycisk LogIn.

### Dane testowe

“email”: “krzysztofradzieta@outlook.com”,
“password”: “test142@”

### Oczekiwany wynik

Użytkownik powinien zostać przekierowany na stronę główną - /dashboard po pomyślnym zalogowaniu.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T002: Wylogowanie z aplikacji

### Opis testu

Sprawdzenie, czy użytkownik może się wylogować.

### Warunki wstępne

Użytkownik musi być zalogowany w aplikacji.

### Kroki testu

1. Upewnij się, że jesteś zalogowany w aplikacji, przez przejście na adres /dashboard.
2. Naciśnij skrajny prawy przycisk z paska nawigacji w wersji desktopowej lub ostatnią ikonkę z rozwijanego menu w wersji mobilnej.

### Oczekiwany wynik

Użytkownik powinien zostać przekierowany na stronę logowania - /login po pomyślnym wylogowaniu.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T003: Dodawanie nowego produktu

### Opis testu

Sprawdzenie, czy użytkownik jest w stanie dodać nowy produkt.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą inną niż operator wózka (cart operator).

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Warehouse”.
2. Po prawej stronie od pola wyszukiwarki kliknij na przycisk “Add new”.
3. Uzupełnij dane nowego produktu.
4. Naciśnij na przycisk “Add product”.

### Dane testowe

“sku”: “ABC1334dd5”,
“name”: “3D printer - Flashforge Adventurer 3 Pro 2”,
“description”: “Another great offering from Flashforge. Adventurer 3 Pro 2 offers increased printing speed, an improved cooling system and a PEI-coated plate known for excellent adhesion and easy detachment of prints. The dimensions of the printer are 388 x 340 x 405 mm and its working area is 150 x 150 x 150 mm.”,
“stockQuantity”: 21,
“price”: 499.99,
“currency”: “PLN”

### Uwagi

Należy pamiętać, że SKU powinno być unikatowe dla każdego produktu. W przypadku wykonywania testu, upewnij się, że produkt z SKU testowym nie istnieje w bazie, lub zmodyfikuj SKU, tak aby było unikatowe.

### Oczekiwany wynik

Na górze strony wyświetlić powinna się wiadomość z komunikatem: “Product added successful”, formularz powinien zostać zablokowany, stepper nad formularzem powinien przejść do punktu drugiego - “Add product images”, pod formularzem powinna pokazać się sekcja “Add images of product” umożliwiająca upload zdjęć produktu.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T004: Wyszukiwanie produktu po nazwie

### Opis testu

Sprawdzenie poprawności działania wyszukiwarki produktów po nazwie produktu.

### Warunki wstępne

Użytkownik musi być zalogowany, produkt z danymi testowymi musi istnieć w bazie.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Warehouse”.
2. W polu wyszukiwarki wpisz wartość pola Name z danych testowych.

### Dane testowe

Name: 3D printer - Flashforge Adventurer 3 Pro 2

### Oczekiwany wynik

Jako pierwszy element listy produktów powinien się pokazać ten o wprowadzonej w polu wyszukiwarki nazwie.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T005: Generowanie podsumowania PDF zamówienia

### Opis testu

Sprawdzenie poprawności działania generowania podsumowania PDF zamówienia.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą różną niż cart operator i warehouseman. W bazie musi istnieć przynajmniej jedno zamówienie.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Orders”.
2. Wybierz pierwsze (dowolne) zamówienie.
3. Naciśnij na przycisk “PDF”.
4. Otwórz pobrany dokument.
5. Porównaj dane z zamówienia w aplikacji z danymi w wygenerowanym dokumencie PDF.

### Oczekiwany wynik

Plik PDF z podsumowaniem zamówienia powinien się pobrać po naciśnięciu na przycisk. Pobrany plik, powinien zawierać te same dane (nazwę, SKU, koszt zamówienia itd.) co dane zamówienia widoczne na stronie.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T006: Dodawanie nowego pracownika

### Opis testu

Sprawdzenie, czy użytkownik o roli manager jest w stanie dodać nowego pracownika.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą manager.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Employees”.
2. Po prawej stronie od pola wyszukiwarki kliknij na przycisk “Add new”.
3. Uzupełnij dane pracownika.
4. Naciśnij na przycisk “Add Employee”.

### Dane testowe

"name": "Władysław",
"surname": "Testowy",
"email": "test142xyz@gmail.com",
"role": "warehouseman",
"salary": 4300,
"contractType": "Employment Contract",
"currency": "PLN",
"address": "ul. Przykładowa 3",
"city": "Warszawa",
"country": "Polska",
"postalCode": "00-001",
"phoneNumber": "+48-562-843-903",
"birthDate": "2001-06-26"

### Uwagi

Należy pamiętać, że email powinien być unikatowy dla każdego pracownika. W przypadku wykonywania testu, upewnij się, że pracownik z emailem testowym nie istnieje w bazie, lub zmodyfikuj email, tak aby było unikatowe.

### Oczekiwany wynik

Użytkownik powinien zostać przekierowany na stronę ze wszystkimi pracownikami - /employees, a na ostatniej pozycji listy powinien znajdować się nowo dodany pracownik.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T007: Wyszukiwanie pracowników po email

### Opis testu

Sprawdzenie poprawności działania wyszukiwarki pracowników po ich email.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą różną niż cart operator oraz warehouseman. Test o ID: T006 musi zostać zakończony powodzeniem.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Employees”.
2. W polu wyszukiwarki wprowadź dane testowe.

### Dane testowe

"email": "test142xyz@gmail.com"

### Uwagi

Wpisywany email musi być tym samym, który został podany w teście ID: T006.

### Oczekiwany wynik

Jako jedyny element listy powinien zostać wyświetlony pracownik, którego email został wpisany w polu wyszukiwarki.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T008: Edycja danych pracownika

### Opis testu

Sprawdzenie poprawności działania edycji danych pracownika.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą różną niż cart operator oraz warehouseman. Testy o ID: T006 oraz T007 muszą zostać zakończone powodzeniem.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Employees”.
2. W polu wyszukiwarki wprowadź email z danych testowych.
3. Dla znalezionego pracownika naciśnij przycisk “Edit”.
4. W polu Country zmień wartość z obecnego kraju na jakikolwiek inny.
5. Naciśnij przycisk “Edit Employee”.
6. Naciśnij przycisk “Go back” w prawym dolnym rogu ekranu.
7. Ponownie wyszukaj wybranego pracownika - punkt 2 testu.
8. Sprawdź wartość pola “Country” w danych znalezionego użytkownika.

### Dane testowe

"email": "test142xyz@gmail.com"

### Uwagi

Wpisywany w polu wyszukiwarki email musi być tym samym, który został podany w teście ID: T006.

### Oczekiwany wynik

Po wykonaniu punktu 5 powinna wyświetlić się wiadomość z komunikatem - “Employee edited successfully”. Sprawdzona w punkcie 8 wartość powinna być równa podanej w punkcie 4-tym nazwie Państwa.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T009: Edycja danych pracownika

### Opis testu

Sprawdzenie poprawności działania edycji danych pracownika.

### Warunki wstępne

Użytkownik musi być zalogowany na konto z rolą różną niż cart operator oraz warehouseman. Testy o ID: T006 oraz T007 muszą zostać zakończone powodzeniem.

### Kroki testu

1. Z sekcji nawigacji kliknij odnośnik “Employees”.
2. W polu wyszukiwarki wprowadź email z danych testowych.
3. Dla znalezionego pracownika naciśnij przycisk “Edit”.
4. W polu Country zmień wartość z obecnego kraju na jakikolwiek inny.
5. Naciśnij przycisk “Edit Employee”.
6. Naciśnij przycisk “Go back” w prawym dolnym rogu ekranu.
7. Ponownie wyszukaj wybranego pracownika - punkt 2 testu.
8. Sprawdź wartość pola “Country” w danych znalezionego użytkownika.

### Dane testowe

"email": "test142xyz@gmail.com"

### Uwagi

Wpisywany w polu wyszukiwarki email musi być tym samym, który został podany w teście ID: T006.

### Oczekiwany wynik

Po wykonaniu punktu 5 powinna wyświetlić się wiadomość z komunikatem - “Employee edited successfully”. Sprawdzona w punkcie 8 wartość powinna być równa podanej w punkcie 4-tym nazwie Państwa.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY

## T010: Resetowanie hasła

### Opis testu

Sprawdzenie poprawności procesu resetowania hasła.

### Warunki wstępne

Skrzynka pocztowa, na której email będziesz się logować musi należeć do użytkownika przeprowadzającego test. Użytkownik musi posiadać konto w aplikacji, na wskazany mail. Stan początkowy to konto wylogowane.

### Kroki testu

1. Przejdź na główną stronę aplikacji.
2. Naciśnij przycisk LogIn - /login.
3. Naciśnij na hiperłącze “Forgot Your password?”.
4. Wprowadź email konta, do którego chcesz zresetować hasło.
5. Naciśnij na przycisk “Send reset link”.
6. Sprawdź skrzynkę pocztową adresu, który wprowadziłeś.
7. Wejdź w wiadomość otrzymaną od adresu krzysztofradzieta@outlook.com.
8. Kliknij w link znajdujący się w niej.
9. Na stronie z linku wprowadź dane: odpowiednio nowe hasło w polu: New password oraz napisz je ponownie w polu Confirm new password.
10. Naciśnij na przycisk “Set new password”.
11. Uzupełnij dane logowania - email oraz nowo podane hasło.
12. Naciśnij przycisk “LogIn”.

### Oczekiwany wynik

Po wykonaniu punktu 5, na wskazany w punkcie 4 email powinna zostać dostarczona wiadomość z linkiem do resetu oraz informacją, że będzie on ważny przez 24h, a jeśli nie podejmowano próby resetowania hasła o zignorowaniu tej wiadomości. Na stronie aplikacji po tym samym punkcie powinna się pojawić wiadomość o treści: “Email sent”. Pole email powinno zostać wyczyszczone. Finalnym wynikiem testu powinna być zdolność do zalogowania się do aplikacji przy użyciu nowego hasła.

### Faktyczny wynik

Zgodny z oczekiwanym.

### Status

ZALICZONY
