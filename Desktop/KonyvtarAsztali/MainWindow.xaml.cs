using System.Collections.ObjectModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace KonyvtarAsztali;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
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