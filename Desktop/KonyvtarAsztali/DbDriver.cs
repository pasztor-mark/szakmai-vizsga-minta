using System.Windows;
using MySql.Data.MySqlClient;

namespace KonyvtarAsztali;

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