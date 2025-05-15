## Asztali

### Rövid leírás
Komplex konzolos, valamint grafikus alkalmazás készítése C# vagy Java nyelven.
### Pontozás
| Szempont                                                   | Érték   |
| ---------------------------------------------------------- | ------- |
| konzolos asztali alkalmazásfejlesztés C# vagy Java nyelven | 15 pont |
| grafikus asztali alkalmazásfejlesztés C# vagy Java nyelven | 10 pont |

### Dependency-k
- .NET 6.0, vagy korábbi
- NuGet package: MySQL.Data

### Fájlstruktúra
```python
## A projekt fájlok automatikusan lettek generálva, nem kell szerkeszteni egyiket se.
- FeladatAsztali.sln # projekt fájl
	- FeladatAsztali.csproj # projekt fájl
		- App.xaml # Alkalmazás markup fájlja
			- App.xaml.cs # Alkalmazás markup fájlhoz tartozó C# kód
		- MainWindow.xaml # Grafikus képernyőhöz tartozó markup
			- MainWindow.xaml.cs # Grafikus képernyő markupjához tartozó C# kód
		- DbDriver.cs # Adatbázis utility
		- Book.cs # Könyv/adattag osztály
		- Statistics.cs # Statisztikai műveletekhez tartozó osztály
		- AssemblyInfo.cs # projekt fájl
```
### Típusfeladatok
- Objektum-orientált programozás
    - Osztálykezelés
```csharp
public class Book  //osztály deklarációja
{  
	// mezők definíciója
    private int id;  
    private string title;  
    private string author;  
    private int publish_year;  
    private int page_count;
    // a mezőket elég megadni osztálynál, kijelölés után jobb klikk -> izzó ikon -> generate code le tud generálni konstruktort, gettereket és settereket, az összes alábbi kód IDE által lett generálva

	//konstruktor
    public Book(int id, string title, string author, int publishYear, int pageCount)  
    {  
        this.id = id;  
        this.title = title;  
        this.author = author;  
        this.publish_year = publishYear;  
        this.page_count = pageCount;  
    }  
  //getterek és setterek
    public int Id  
    {  
        get => id;  
        set => id = value;  
    }  
  
    public string Title  
    {  
        get => title;  
        set => title = value ?? throw new ArgumentNullException(nameof(value));  
    }  
  
    public string Author  
    {  
        get => author;  
        set => author = value ?? throw new ArgumentNullException(nameof(value));  
    }  
  
    public int PublishYear  
    {  
        get => publish_year;  
        set => publish_year = value;  
    }  
  
    public int PageCount  
    {  
        get => page_count;  
        set => page_count = value;  
    }  
  
  //ToString metódus
    public override string ToString()  
    {  
        return $"{author} - {title} - {PageCount} - {PublishYear}";  //formázott string: $"szöveg - {valtozo}"
    }  
}```

- Argumentum-kezelés
	- *A program indításakor amennyiben `--stat` parancssori argumentum lett megadva úgy a konzolos alkalmazásrész induljon el.*
	- Konzolos és grafikus alkalmazás egy kódbázisban
 #### **App.xaml.cs**
```csharp
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        if (e.Args.Length > 0 && e.Args[0].ToLower().Equals("stat")) //ha van argumentum, és stat, akkor a statisztikai osztályt indítja el
        {
            Statistics.Stat(); //statikus osztály metódusa
            Shutdown(); //WPF app leállítása, a ciklus elején
            return; //kilép a kódból futás után
        }
        base.OnStartup(e); // alap WPF indulás
    }
}
```

- Adatbázishoz kapcsolódás
    - Lekérdezések
```csharp
public class DbDriver
{
    static string server = "localhost"; // localhost itt mindig megfelel
    static string port = "3306"; //MySQL-nél a port jellemzően 3306, XAMPP-ban meg lehet nézni
    static string database = "books"; // adatbázis neve
    static string user = "root"; // root mint felhasználó használhatja az adatbázist
    private readonly string _connectionString = ($"Server={server};Port={port};Database={database};User={user}"); //sorrend lényegtelen, a Server, Port, Database és User kötelező
    
    private MySqlConnection GetConnection() //metódus a MySQL kapcsolat létrehozására
    {
	    try
		{
		    var connection = new MySqlConnection(_connectionString); //kapcsolat létrehozása a stringgel
		    connection.Open(); //megnyitja a kapcsolatot, szükséges a megfelelő működéshez
	        return connection;
		}
		catch(Exception e)
		{
			string error = "Nem sikerült csatlakozni az adatbázishoz";  //hibaüzenet
			Console.WriteLine(error);   //konzolba írja a hibát
			if (Application.Current.MainWindow != null)  //ha van megnyitva WPF ablak
			{  
			    MessageBox.Show(error, "Hiba!");  //felugró ablakban mutatja a hibát
			}  
			Environment.Exit(-1);  //kilép a programból
			throw; //stacktrace-t meghagyja
		}
    }

    public List<Book> GetBooks() //objektumok lekérése 
    {
        List<Book> books = new List<Book>();  
        var cmd = new MySqlCommand("SELECT * FROM books;", GetConnection());
        var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Book book = new Book( //konstruktor alapján adatok megadása
            reader.GetInt32("id"), //reader.Get[adattípus]("adatbázis oszlop neve")
             reader.GetString("title"),
              reader.GetString("author"),
               reader.GetInt32("publish_year"),
                reader.GetInt32("page_count"));
                
            books.Add(book);
        }
        return books;
    }
    public bool deleteBook(int id) //adat törlése id alapján
    {
        var cmd = new MySqlCommand(
        $"DELETE FROM books WHERE id={id};" // ID alapján törlés a books táblából
        , GetConnection()); //connection, mint argument
        var res = cmd.ExecuteNonQuery(); //res = törölt sorok száma (törlésnél 1)
        return res > 0; //igaz, ha van legalább 1 törölt sor, hamis, ha sikertelen
        
    }
}
```
- Grafikus megjelenés példa alapján, adat-binding
    - Visual Studioban össze lehet huzogatni, de Grid és StackPanel használata ajánlott


```xml
<Window x:Class="name.MainWindow" 
        Title="MainWindow" Height="450" Width="800">
<StackPanel>
<Button Content="Törlés" Click="onDelete" Padding="6" HorizontalAlignment="Left" Margin="5"></Button>
<ListView x:Name="ListView">
    <ListView.View>
        <GridView>
            <GridViewColumn Header="ID" DisplayMemberBinding="{Binding Id}"/>
            <GridViewColumn Header="Title"  DisplayMemberBinding="{Binding Title}"/>
            <GridViewColumn Header="Author" DisplayMemberBinding="{Binding Author}"/>
            <GridViewColumn Header="Publish Year" DisplayMemberBinding="{Binding PublishYear}"/>
            <GridViewColumn Header="Page Count" DisplayMemberBinding="{Binding PageCount}"/>
        </GridView>
    </ListView.View>
</ListView>
</StackPanel>
</Window>
```

```
- StackPanel: függőlegesen elrendezi az elmeket
- ListView: táblázat
	- x:Name: code-behind (C# .xaml.cs fájlban az itt megadott névként lehet hivatkozni rá)
- ListView.View: a táblázat megjelenített eleme
- GridView: megjelenített rács
- GridViewColumn: a táblázat oszlopainak neve
	- Header: kijelzett név
	- DisplayMemberBinding: adat-bindinghoz használt property
		- formája: ="{Binding *getterekben meghatározott név*}"
```

XAML-hez tartozó C# kód:
```csharp
public partial class MainWindow : Window  
{  
        DbDriver db = new DbDriver();  //osztályként meghatározott adatbázis utility
    public MainWindow()  
    {  
        ObservableCollection<Book> books = new ObservableCollection<Book>(db.GetBooks());  //ObservableCollection<T>: List<T> is megfelel, de a frissítések és konvenciók miatt jobb ezt használni. Bemenetként egy List<T> objektumot használ.
        InitializeComponent();  //alap WPF funkció
        DataContext = books;  //DataContext: adat-bindinghoz használt kontextus, ezeket az adatoknak az attribútumait tudja használni a fordító. WPF bindingnál **kötelező** 
        ListView.ItemsSource = books;  //ListView: a XAML fájlban az x:Name="ListView" attribútummal megjelölt tag. ItemsSource: a bindinghoz használt adathalmaz
    }  
  
    private void onDelete(object sender, RoutedEventArgs e) // Törlés gomb event handler. Az object sender és RoutedEventArgs e kötelező.  
    {  
        var selected = ListView.SelectedItem as Book; //ListView-ból ki tudjuk szedni az aktuálisan kijelölt elemet.  
        if (selected == null) //Ha nincs mi kijelölve  
        {  
            MessageBox.Show("Válassz ki egy elemet!", "Hoppá!"); //MessageBox figyelmezteti a felhasználót, hogy válasszon ki valamit  
            return; //funkcióból kilépés      
        }  
  
		var confirm = MessageBox.Show( //Megerősítési dialógus
		$"Biztosan törlöd a(z) {selected.Id} azonosítójú {selected.Title} c. könyvet?", //szöveg
		 "Biztos?", //dialógus címe
		MessageBoxButton.YesNoCancel //igen/nem/vissza gomb
		);  
		if (confirm != MessageBoxResult.Yes)  //ha nincs megerősítve
		{  
		    return;  //lépjen ki a funkcióból
		}  
		bool state = db.deleteBook(selected.Id); // törlés indítása, állapot lekérdezésével  
		if (state)  //ha sikeres
		{  
		    ObservableCollection<Book> refreshedBooks = new ObservableCollection<Book>(db.GetBooks()); //könyvek újrakérdezése 
		    ListView.ItemsSource = refreshedBooks; //lista frissítése  
		} 
    }  
}
```
### Részfeladatok
- Lista elemszámának megadása
```csharp
public static int getLength()  
{  
    return books.Count; //books.Count visszaadja az elemszámot. A Count() funkció ugyanazt adja vissza, viszont az LINQ-es funkció, ezért lassabb. 
}

Console.WriteLine($"{getLength()} könyv van a listában.");
```
- Kevesebb-mint kiválasztás
```csharp
public static bool getEarlierThan(int year)  
{  
    foreach (Book book in books)  //listán végig iterálunk
    {  
        if (book.PublishYear < year) return true;  //ha talál egyet, igaz
    }  
    return false;  //ha nem talál egyet se, hamis
}


int earlierThan = 1950;  
Console.WriteLine(getEarlierThan(earlierThan) ? $"Van {earlierThan}-nál/nél régebbi könyv" : $"Nincs {earlierThan}-nál/nél régebbi könyv");
```
- Maximum-kiválasztás 
```csharp
public static Book getLongestBook()  
{  
    int min = 0;  //alap érték 0, mindig amikor talál nagyobbat, megváltozik
    Book longest = null;  //minimumhoz tartozó könyv
    foreach (Book book in books)  
    {  
        if (book.PageCount > min) 
        { //ha nagyobb, mint a minimum
	        longest = book; //beállítja a leghosszabbat az aktuális könyvre
	        min = book.PageCount; //minimum érték beállítása
	    }  
    }  
    return longest;  //ciklus végén visszaadja a leghosszabbat
}

Console.WriteLine($"Leghosszabb könyv: ${getLongestBook()}");
```
- Key-value pair keresés (leggyakrabban előforduló attribútum)
```csharp
public static KeyValuePair<string, int> getAuthorWithMostBooks()  
{  
    Dictionary<string, int> authors = new Dictionary<string, int>(); 
    //Dictionary: egy kulcs (itt string) csak egyszer szerepelhet, és egy érték (itt int) tartozik.  
    foreach (Book book in books)  
    {  
        if (!authors.ContainsKey(book.Author))   //ha még nincs author, mint kulcs
        {  
            authors.Add(book.Author, 1);  //hozzáadja az írót a dictionary-be, és hozzáad egy darabszámot (először 1)
        }  
        else { authors[book.Author]++; } //ha már tartalmazza az írót, megnöveli egyel a hozzá tartozó darabszámot  
    }  
  
    return authors  
        .OrderByDescending(kvp => kvp.Value) //legnagyobb érték elől  
        .First();  //a rendezett dictionary első eleme
}


KeyValuePair<string, int> authorPair = getAuthorWithMostBooks();  
Console.WriteLine($"Legtöbb könyvet írt író: {authorPair.Key} - {authorPair.Value} db könyv");
```
- Felhasználói input alapján keresés
```csharp
public static string findBookAuthor()  
{  
    Console.WriteLine("Írja be a könyv nevét");  // Utasítás a felhasználónak
    string title = Console.ReadLine().ToLower();  // Könyv címének beolvasása
  
    foreach (Book book in books)  
    {  //Könyv listán végigiterálunk
        if (book.Title.ToLower() == title) return $"A megadott könyv szerzője {book.Author}";  //ha talál ilyen könyvet, visszaadja a szerzőt
    }  
  
    return "Nincs ilyen könyv a listában...";  //ha nem talált
}
```

### Pontozás
#### Konzolos

| Feladat  | Leírás                                                                                                                                                                                      | Pont |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: |
| a)       | Létrehozta a projektet, KonyvtarAsztali néven. A program szintaktikai hiba mentes, futtatható.                                                                                              |  1   |
| b)       | Létrehozta a Book osztályt. Helyesen definiálta az osztály adattagjait és létrehozott az adattagok számára gettereket. Létrehozott paraméteres konstruktort az adattagok inicializálásához. |  1   |
| c)       | Konzolos alkalmazásrész - Statistics osztály                                                                                                                                                |      |
|          | − Létrehozta a Statistics osztályt                                                                                                                                                          |  1   |
|          | − A konzolos alkalmazásrész a --stat parancssori argumentum megadásával indul. Ellenkező esetben a grafikus alkalmazásrész indul el.                                                        |  1   |
|          | − Az osztály rendelkezik egy függvénnyel, amely lekérdezi és eltárolja az adatbázisban tárolt könyveket, egy books nevű lista adattagba.                                                    |  1   |
|          | − Ha nem sikerül kapcsolódni az adatbázishoz, akkor hibaüzenet jelenik meg a konzolon és a program futása megszakad                                                                         |  1   |
| d)       | Statisztikai feladatok                                                                                                                                                                      |      |
|          | − A részfeladatok számára külön eljárásokat és függvényeket hoz létre. Minden függvénynek egy meghatározott feladata van.                                                                   |  1   |
|          | − A kiírások a mintának megfelelőek                                                                                                                                                         |  1   |
|          | − Helyesen határozza meg az 500 oldalnál hosszabb könyvek számát                                                                                                                            |  1   |
|          | − Helyesen dönti el, hogy szerepel-e az adatok között 1950-nél régebbi könyv.                                                                                                               |  1   |
|          | − Helyesen határozza meg a leghosszabb könyvet                                                                                                                                              |  1   |
|          | − Helyesen határozza meg a legtöbb könyvvel rendelkező szerzőt                                                                                                                              |  2   |
|          | − Bekér a konzolról egy könyv címet, ezt eltárolja a feladat megoldásához.                                                                                                                  |  1   |
|          | − A bekért könyv cím alapján megfelelően határozza meg, hogy hányszor lett a könyv kikölcsönözve. (??? ez nem volt benne 1 feladatban se)                                                   |  1   |
| Összesen |                                                                                                                                                                                             |  15  |
#### Grafikus
| Feladat  | Leírás                                                                                                                                                         | Pont |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: |
|          | 4. feladat – Grafikus alkalmazásrész                                                                                                                           |      |
| a)       | Vizuális felület kialakítása                                                                                                                                   |      |
|          | − Elhelyezett egy nyomógombot a kiválasztott könyv törléséhez                                                                                                  |  1   |
|          | − Felvett egy megfelelő komponenst (Java: ListView, TableView / C#: ListBox, ListView, DataGrid) a könyvek táblázatszerű megjelenítéséhez                      |  1   |
| b)       | Adatok listázása                                                                                                                                               |      |
|          | − A program indulásakor feltölti a listát az adatbázisból kiolvasott könyvekkel                                                                                |  1   |
|          | − Ha nem sikerül kapcsolódni az adatbázishoz, akkor hibaüzenet jelenik meg egy felugró ablakban, a hibaüzenet bezárásával az alkalmazás leáll                  |  2   |
| c)       | Könyv törlése                                                                                                                                                  |      |
|          | − Gombkattintásra, ha nincs kiválasztva könyv, akkor felugró ablakban hibaüzenet jelenik meg                                                                   |  1   |
|          | − Ha ki lett választva könyv, akkor felugróablak jelenik meg a művelet megerősítéséhez                                                                         |  1   |
|          | − Ha a felhasználó azt választotta, hogy biztos szeretné törölni a könyvet, akkor a könyv törlésre kerül az adatbázisból, ellenkező esetben nem történik semmi |  1   |
|          | − A törlés sikerességéről vagy sikertelenségéről a felugróablakban figyelmeztet. Sikertelen törlés esetén kiírja annak okát is.                                |  1   |
|          | − Törlés után a lista tartalma frissül                                                                                                                         |  1   |
| Összesen |                                                                                                                                                                |  10  |