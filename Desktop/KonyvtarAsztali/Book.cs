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
}