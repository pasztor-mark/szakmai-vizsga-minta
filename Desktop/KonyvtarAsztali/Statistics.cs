
namespace KonyvtarAsztali;

public class Statistics
{
    private static DbDriver conn = new DbDriver() ;
    static List<Book> books = conn.GetBooks();
    public static void Stat()
    {
        Console.WriteLine($"{getLength()} könyv van a listában.");
        int earlierThan = 1950;
        Console.WriteLine(getEarlierThan(earlierThan) ? $"Van {earlierThan}-nál/nél régebbi könyv" : $"Nincs {earlierThan}-nál/nél régebbi könyv");
        Console.WriteLine($"Leghosszabb könyv: ${getLongestBook()}");
        KeyValuePair<string, int> authorPair = getAuthorWithMostBooks();
        Console.WriteLine($"Legtöbb könyvet írt író: {authorPair.Key} - {authorPair.Value} könyv");
        Console.WriteLine(findBookAuthor());
    }
    public static int getLength()  
    {  
        return books.Count; //books.Count visszaadja az elemszámot. A Count() funkció ugyanazt adja vissza, viszont az LINQ-es funkció, ezért lassabb. 
    }
    public static bool getEarlierThan(int year)  
    {  
        foreach (Book book in books)  //listán végig iterálunk
        {  
            if (book.PublishYear < year) return true;  //ha talál egyet, igaz
        }  
        return false;  //ha nem talál egyet se, hamis
    }
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
}