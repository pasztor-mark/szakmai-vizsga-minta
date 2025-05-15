using System.Configuration;
using System.Data;
using System.Windows;

namespace KonyvtarAsztali;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
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